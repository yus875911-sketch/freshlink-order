-- ========== 枚举 ==========
create type public.app_role as enum ('platform_admin','platform_ops','platform_finance','store_manager','store_buyer','supplier_admin','supplier_sales','supplier_delivery');

-- ========== 用户与角色 ==========
create table public.profiles (
  id uuid primary key,
  email text not null,
  full_name text not null default '',
  phone text,
  store_id uuid,
  supplier_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create table public.demo_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  label text not null,
  role app_role not null,
  store_id uuid,
  supplier_id uuid,
  sort_order int not null default 0
);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.my_role()
returns app_role language sql stable security definer set search_path = public as $$
  select role from public.user_roles where user_id = auth.uid() limit 1
$$;

create or replace function public.is_platform()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid()
    and role in ('platform_admin','platform_ops','platform_finance'))
$$;

create or replace function public.is_platform_manage()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid()
    and role in ('platform_admin','platform_ops'))
$$;

create or replace function public.can_see_bills()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid()
    and role in ('platform_admin','platform_ops','platform_finance','store_manager','supplier_admin'))
$$;

create or replace function public.my_store_id()
returns uuid language sql stable security definer set search_path = public as $$
  select store_id from public.profiles where id = auth.uid()
$$;

create or replace function public.my_supplier_id()
returns uuid language sql stable security definer set search_path = public as $$
  select supplier_id from public.profiles where id = auth.uid()
$$;

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- 演示账号首次登录时领取自己的档案与角色
create or replace function public.claim_demo_profile()
returns void language plpgsql security definer set search_path = public as $$
declare d public.demo_accounts;
begin
  select * into d from public.demo_accounts where lower(email) = lower(coalesce(auth.jwt() ->> 'email','')) limit 1;
  if d.id is null then return; end if;
  insert into public.profiles (id, email, full_name, store_id, supplier_id)
  values (auth.uid(), d.email, d.label, d.store_id, d.supplier_id)
  on conflict (id) do update set full_name = excluded.full_name, store_id = excluded.store_id, supplier_id = excluded.supplier_id;
  insert into public.user_roles (user_id, role) values (auth.uid(), d.role) on conflict do nothing;
end; $$;

-- ========== 基础档案 ==========
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.regions(id),
  name text not null,
  code text not null unique,
  delivery_days int[] not null default '{1,2,3,4,5,6,7}',
  cutoff_time time not null default '16:00',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  region_id uuid not null references public.regions(id),
  address text not null default '',
  contact_name text not null default '',
  contact_phone text not null default '',
  settlement_type text not null default 'monthly',
  credit_days int not null default 30,
  min_order_amount numeric(12,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  uscc text not null default '',
  license_no text not null default '',
  license_expiry date,
  contact_name text not null default '',
  contact_phone text not null default '',
  settlement_type text not null default 'monthly',
  credit_days int not null default 30,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id),
  code text not null unique,
  name text not null,
  quote_cycle text not null default 'weekly',
  need_approval boolean not null default true,
  price_alert_percent numeric(6,2) not null default 10,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.supplier_regions (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  daily_capacity int not null default 100,
  is_active boolean not null default true,
  unique (supplier_id, region_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  code text not null unique,
  name text not null,
  spec text not null default '',
  unit text not null default '斤',
  pack_unit text not null default '箱',
  conversion numeric(10,2) not null default 1,
  is_weighed boolean not null default false,
  image_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  supplier_sku text not null default '',
  min_qty numeric(10,2) not null default 1,
  supply_status text not null default 'on_sale',
  created_at timestamptz not null default now(),
  unique (supplier_id, product_id)
);

create table public.store_supplier_bindings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  region_id uuid not null references public.regions(id),
  category_id uuid not null references public.categories(id),
  primary_supplier_id uuid not null references public.suppliers(id),
  backup_supplier_id uuid references public.suppliers(id),
  effective_from date not null default current_date,
  effective_to date,
  change_reason text,
  status text not null default 'active',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint binding_primary_not_backup check (backup_supplier_id is null or backup_supplier_id <> primary_supplier_id)
);
create index on public.store_supplier_bindings (store_id, category_id);

-- ========== 价格 ==========
create table public.price_tasks (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  period text not null,
  due_date date not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.price_versions (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price numeric(12,2) not null,
  effective_from date not null,
  effective_to date,
  status text not null default 'pending',
  source text not null default 'supplier',
  reason text,
  change_amount numeric(12,2) not null default 0,
  change_percent numeric(8,2) not null default 0,
  price_task_id uuid references public.price_tasks(id),
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.price_versions (supplier_id, product_id, status);

-- ========== 订单 ==========
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,
  store_id uuid not null references public.stores(id),
  region_id uuid not null references public.regions(id),
  status text not null default 'pending_confirm',
  delivery_date date not null,
  delivery_slot text not null default '08:00-10:00',
  address text not null default '',
  remark text,
  total_amount numeric(14,2) not null default 0,
  price_locked_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sub_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id),
  sub_no text not null unique,
  status text not null default 'pending_accept',
  amount numeric(14,2) not null default 0,
  accept_deadline timestamptz,
  reject_reason text,
  delivery_status text,
  delivery_person text,
  delivery_phone text,
  eta timestamptz,
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.sub_orders (supplier_id, status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sub_order_id uuid references public.sub_orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  supplier_id uuid not null references public.suppliers(id),
  qty numeric(12,2) not null,
  unit_price numeric(12,2) not null,
  amount numeric(14,2) not null,
  price_version_id uuid references public.price_versions(id),
  status text not null default 'normal',
  created_at timestamptz not null default now()
);
create index on public.order_items (order_id);

create table public.order_status_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  sub_order_id uuid references public.sub_orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  operator_id uuid,
  operator_name text not null default '系统',
  remark text,
  created_at timestamptz not null default now()
);

create table public.order_assign_logs (
  id uuid primary key default gen_random_uuid(),
  sub_order_id uuid not null references public.sub_orders(id) on delete cascade,
  from_supplier_id uuid references public.suppliers(id),
  to_supplier_id uuid not null references public.suppliers(id),
  reason text not null default '',
  operator_id uuid,
  operator_name text not null default '',
  created_at timestamptz not null default now()
);

-- ========== 验收与售后 ==========
create table public.acceptance_records (
  id uuid primary key default gen_random_uuid(),
  sub_order_id uuid not null references public.sub_orders(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  ordered_qty numeric(12,2) not null,
  received_qty numeric(12,2) not null default 0,
  diff_qty numeric(12,2) not null default 0,
  diff_type text,
  quality_status text not null default 'ok',
  photos text[] not null default '{}',
  remark text,
  operator_id uuid,
  created_at timestamptz not null default now()
);

create table public.after_sales (
  id uuid primary key default gen_random_uuid(),
  sub_order_id uuid not null references public.sub_orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete cascade,
  store_id uuid not null references public.stores(id),
  supplier_id uuid not null references public.suppliers(id),
  type text not null,
  qty numeric(12,2) not null default 0,
  reason text not null default '',
  responsibility text,
  deduction_amount numeric(12,2) not null default 0,
  status text not null default 'pending',
  handled_by uuid,
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

-- ========== 对账 ==========
create table public.bills (
  id uuid primary key default gen_random_uuid(),
  bill_no text not null unique,
  type text not null,
  target_id uuid not null,
  period_start date not null,
  period_end date not null,
  order_amount numeric(14,2) not null default 0,
  delivery_fee numeric(14,2) not null default 0,
  refund_amount numeric(14,2) not null default 0,
  deduction_amount numeric(14,2) not null default 0,
  payable_amount numeric(14,2) not null default 0,
  paid_amount numeric(14,2) not null default 0,
  status text not null default 'pending',
  dispute_reason text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bill_items (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  order_id uuid references public.orders(id),
  sub_order_id uuid references public.sub_orders(id),
  order_no text not null default '',
  delivery_date date,
  amount numeric(14,2) not null default 0,
  deduction_amount numeric(14,2) not null default 0,
  refund_amount numeric(14,2) not null default 0,
  remark text
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  direction text not null,
  amount numeric(14,2) not null,
  method text not null default 'transfer',
  paid_at date not null default current_date,
  invoice_no text,
  proof_url text,
  remark text,
  operator_id uuid,
  created_at timestamptz not null default now()
);

-- ========== 系统 ==========
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  audience text,
  target_id uuid,
  title text not null,
  content text not null default '',
  type text not null default 'system',
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid,
  operator_name text not null default '',
  module text not null,
  action text not null,
  target_type text,
  target_id uuid,
  before_value jsonb,
  after_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

-- ========== updated_at 触发器 ==========
create trigger t_profiles_u before update on public.profiles for each row execute function public.update_updated_at_column();
create trigger t_stores_u before update on public.stores for each row execute function public.update_updated_at_column();
create trigger t_suppliers_u before update on public.suppliers for each row execute function public.update_updated_at_column();
create trigger t_products_u before update on public.products for each row execute function public.update_updated_at_column();
create trigger t_bindings_u before update on public.store_supplier_bindings for each row execute function public.update_updated_at_column();
create trigger t_orders_u before update on public.orders for each row execute function public.update_updated_at_column();
create trigger t_sub_orders_u before update on public.sub_orders for each row execute function public.update_updated_at_column();
create trigger t_bills_u before update on public.bills for each row execute function public.update_updated_at_column();

-- ========== 授权 ==========
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant select on public.demo_accounts to anon;

-- ========== RLS ==========
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.demo_accounts enable row level security;
alter table public.regions enable row level security;
alter table public.stores enable row level security;
alter table public.suppliers enable row level security;
alter table public.categories enable row level security;
alter table public.supplier_regions enable row level security;
alter table public.products enable row level security;
alter table public.supplier_products enable row level security;
alter table public.store_supplier_bindings enable row level security;
alter table public.price_tasks enable row level security;
alter table public.price_versions enable row level security;
alter table public.orders enable row level security;
alter table public.sub_orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_logs enable row level security;
alter table public.order_assign_logs enable row level security;
alter table public.acceptance_records enable row level security;
alter table public.after_sales enable row level security;
alter table public.bills enable row level security;
alter table public.bill_items enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy demo_read on public.demo_accounts for select to anon, authenticated using (true);

create policy profiles_self on public.profiles for select to authenticated using (id = auth.uid() or public.is_platform());
create policy profiles_self_upd on public.profiles for update to authenticated using (id = auth.uid() or public.is_platform_manage());
create policy profiles_ins on public.profiles for insert to authenticated with check (id = auth.uid() or public.is_platform_manage());
create policy roles_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_platform());
create policy roles_admin on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'platform_admin')) with check (public.has_role(auth.uid(),'platform_admin'));

-- 档案类：全员可读，平台运营可写
create policy regions_r on public.regions for select to authenticated using (true);
create policy regions_w on public.regions for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());
create policy categories_r on public.categories for select to authenticated using (true);
create policy categories_w on public.categories for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());
create policy products_r on public.products for select to authenticated using (true);
create policy products_w on public.products for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy stores_r on public.stores for select to authenticated using (public.is_platform() or id = public.my_store_id()
  or exists (select 1 from public.sub_orders s join public.orders o on o.id = s.order_id where o.store_id = stores.id and s.supplier_id = public.my_supplier_id()));
create policy stores_w on public.stores for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy suppliers_r on public.suppliers for select to authenticated using (public.is_platform() or id = public.my_supplier_id() or public.my_store_id() is not null);
create policy suppliers_w on public.suppliers for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy sr_r on public.supplier_regions for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id());
create policy sr_w on public.supplier_regions for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy sp_r on public.supplier_products for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id() or public.my_store_id() is not null);
create policy sp_w on public.supplier_products for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy b_r on public.store_supplier_bindings for select to authenticated using (public.is_platform() or store_id = public.my_store_id()
  or primary_supplier_id = public.my_supplier_id() or backup_supplier_id = public.my_supplier_id());
create policy b_w on public.store_supplier_bindings for all to authenticated using (public.is_platform_manage()) with check (public.is_platform_manage());

create policy pt_r on public.price_tasks for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id());
create policy pt_w on public.price_tasks for all to authenticated using (public.is_platform_manage() or supplier_id = public.my_supplier_id())
  with check (public.is_platform_manage() or supplier_id = public.my_supplier_id());

create policy pv_r on public.price_versions for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id() or public.my_store_id() is not null);
create policy pv_ins on public.price_versions for insert to authenticated with check (public.is_platform_manage() or supplier_id = public.my_supplier_id());
create policy pv_upd on public.price_versions for update to authenticated using (public.is_platform_manage() or (supplier_id = public.my_supplier_id() and status in ('pending','rejected')))
  with check (public.is_platform_manage() or (supplier_id = public.my_supplier_id() and status in ('pending','rejected')));
create policy pv_del on public.price_versions for delete to authenticated using (public.is_platform_manage());

create policy o_r on public.orders for select to authenticated using (public.is_platform() or store_id = public.my_store_id()
  or exists (select 1 from public.sub_orders s where s.order_id = orders.id and s.supplier_id = public.my_supplier_id()));
create policy o_ins on public.orders for insert to authenticated with check (public.is_platform_manage() or store_id = public.my_store_id());
create policy o_upd on public.orders for update to authenticated using (public.is_platform_manage() or store_id = public.my_store_id()
  or exists (select 1 from public.sub_orders s where s.order_id = orders.id and s.supplier_id = public.my_supplier_id()))
  with check (true);

create policy so_r on public.sub_orders for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id()
  or exists (select 1 from public.orders o where o.id = sub_orders.order_id and o.store_id = public.my_store_id()));
create policy so_ins on public.sub_orders for insert to authenticated with check (public.is_platform_manage()
  or exists (select 1 from public.orders o where o.id = sub_orders.order_id and o.store_id = public.my_store_id()));
create policy so_upd on public.sub_orders for update to authenticated using (public.is_platform_manage() or supplier_id = public.my_supplier_id()
  or exists (select 1 from public.orders o where o.id = sub_orders.order_id and o.store_id = public.my_store_id())) with check (true);

create policy oi_r on public.order_items for select to authenticated using (public.is_platform() or supplier_id = public.my_supplier_id()
  or exists (select 1 from public.orders o where o.id = order_items.order_id and o.store_id = public.my_store_id()));
create policy oi_w on public.order_items for all to authenticated using (public.is_platform_manage() or supplier_id = public.my_supplier_id()
  or exists (select 1 from public.orders o where o.id = order_items.order_id and o.store_id = public.my_store_id())) with check (true);

create policy osl_r on public.order_status_logs for select to authenticated using (public.is_platform()
  or exists (select 1 from public.orders o where o.id = order_status_logs.order_id and o.store_id = public.my_store_id())
  or exists (select 1 from public.sub_orders s where s.id = order_status_logs.sub_order_id and s.supplier_id = public.my_supplier_id()));
create policy osl_ins on public.order_status_logs for insert to authenticated with check (true);

create policy oal_r on public.order_assign_logs for select to authenticated using (public.is_platform());
create policy oal_ins on public.order_assign_logs for insert to authenticated with check (public.is_platform_manage());

create policy ar_r on public.acceptance_records for select to authenticated using (public.is_platform()
  or exists (select 1 from public.sub_orders s join public.orders o on o.id = s.order_id
     where s.id = acceptance_records.sub_order_id and (o.store_id = public.my_store_id() or s.supplier_id = public.my_supplier_id())));
create policy ar_w on public.acceptance_records for all to authenticated using (public.is_platform_manage()
  or exists (select 1 from public.sub_orders s join public.orders o on o.id = s.order_id where s.id = acceptance_records.sub_order_id and o.store_id = public.my_store_id()))
  with check (true);

create policy as_r on public.after_sales for select to authenticated using (public.is_platform() or store_id = public.my_store_id() or supplier_id = public.my_supplier_id());
create policy as_w on public.after_sales for all to authenticated using (public.is_platform_manage() or store_id = public.my_store_id()) with check (true);

create policy bills_r on public.bills for select to authenticated using (
  public.can_see_bills() and (public.is_platform()
    or (type = 'store' and target_id = public.my_store_id())
    or (type = 'supplier' and target_id = public.my_supplier_id())));
create policy bills_w on public.bills for all to authenticated using (public.is_platform()
  or (type = 'store' and target_id = public.my_store_id() and public.has_role(auth.uid(),'store_manager'))
  or (type = 'supplier' and target_id = public.my_supplier_id())) with check (true);

create policy bi_r on public.bill_items for select to authenticated using (exists (
  select 1 from public.bills b where b.id = bill_items.bill_id and public.can_see_bills() and (public.is_platform()
    or (b.type = 'store' and b.target_id = public.my_store_id())
    or (b.type = 'supplier' and b.target_id = public.my_supplier_id()))));
create policy bi_w on public.bill_items for all to authenticated using (public.is_platform()) with check (public.is_platform());

create policy pay_r on public.payments for select to authenticated using (exists (
  select 1 from public.bills b where b.id = payments.bill_id and public.can_see_bills() and (public.is_platform()
    or (b.type = 'store' and b.target_id = public.my_store_id())
    or (b.type = 'supplier' and b.target_id = public.my_supplier_id()))));
create policy pay_w on public.payments for all to authenticated using (public.is_platform()) with check (public.is_platform());

create policy n_r on public.notifications for select to authenticated using (user_id = auth.uid() or public.is_platform()
  or (audience = 'store' and target_id = public.my_store_id()) or (audience = 'supplier' and target_id = public.my_supplier_id()));
create policy n_w on public.notifications for all to authenticated using (true) with check (true);

create policy al_r on public.audit_logs for select to authenticated using (public.is_platform());
create policy al_ins on public.audit_logs for insert to authenticated with check (true);