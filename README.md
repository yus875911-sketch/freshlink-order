# FreshLink Order

请帮我构建一个面向餐饮门店的「食材供应链订购系统」，包含三个使用端：平台管理后台、门店移动端、供应商工作台。

【业务背景】

平台是一家食材供应链配送公司，上游对接按品类分工的供应商（蔬菜、肉类、海鲜、冻品、一次性用品等），下游对接餐饮门店。门店通过手机下单，平台按「门店 + 区域 + 品类」的绑定关系把一张订单自动拆给对应供应商，供应商负责报价和配送，平台统一控价，并与门店、供应商分别对账结算。目前 7 家门店、5 家供应商，明年扩展到 40 家以上门店，所以数据结构和权限必须支持规模化，不要写成单店 Demo。

【技术栈】

React 18 + TypeScript + Vite；Tailwind CSS + shadcn/ui；react-router-dom 路由；TanStack Query 数据请求；Supabase 提供 Postgres、Auth、Storage 和 RLS 行级权限；recharts 做图表；tanstack table 做表格。界面全中文，金额单位元保留两位小数，日期格式 YYYY-MM-DD。

【三个端的形态】

1. 平台管理后台：桌面端 Web，左侧固定导航 + 右侧内容区，含看板、表格、筛选、批量导入导出。

2. 门店端：移动端 H5，容器最大宽度 430px 居中，底部 Tab 导航（首页 / 下单 / 订单 / 我的），模拟微信小程序体验。

3. 供应商工作台：桌面端为主，订单和报价页同时适配手机。

【角色与数据权限】

platform_admin 平台管理员（全部权限）、platform_ops 平台运营（门店/区域/供应商/绑定/订单/改派）、platform_finance 平台财务（账单结算，不可改商品价格）、store_manager 门店店长（本店下单、审核、验收、查账）、store_buyer 门店采购/厨师（本店下单、验收，不可看账单）、supplier_admin 供应商管理员、supplier_sales 供应商业务员、supplier_delivery 供应商配送员。

权限必须真正生效：门店只能看到自己门店的商品、订单、账单；供应商只能看到分配给自己的子订单和自己商品的报价；供应商看不到平台售价与毛利；财务看不到商品和价格编辑入口。

【数据库表结构】（用 Supabase 建表，字段名保持一致）

基础档案：regions（区域，含 delivery_days、cutoff_time）、stores（门店，含 region_id、settlement_type、credit_days、min_order_amount）、suppliers（供应商，含 uscc、license_no、license_expiry）、supplier_regions（供应商配送区域与容量）、categories（品类，含 quote_cycle、need_approval、price_alert_percent）、products（商品，含 code、spec、unit、pack_unit、conversion、is_weighed）、supplier_products（供应商商品关联，含 supplier_sku、min_qty、supply_status）、store_supplier_bindings（绑定关系，含 store_id、region_id、category_id、primary_supplier_id、backup_supplier_id、effective_from、effective_to、change_reason）。

价格：price_versions（含 price、effective_from、effective_to、status、source、reason、change_amount、change_percent、created_by、approved_by）、price_tasks（报价任务，含 period、due_date、status）。

订单：orders（主订单，含 order_no、store_id、region_id、status、delivery_date、total_amount、price_locked_at）、sub_orders（子订单，含 order_id、supplier_id、sub_no、status、accept_deadline、reject_reason、delivery_status、delivery_person、eta）、order_items（含 product_id、supplier_id、qty、unit_price、amount、price_version_id、status）、order_status_logs（状态流水）、order_assign_logs（改派记录）。

验收与售后：acceptance_records（含 ordered_qty、received_qty、diff_qty、diff_type、quality_status、photos）、after_sales（含 type、qty、reason、responsibility、deduction_amount、status）。

对账：bills（含 bill_no、type、target_id、period_start、period_end、order_amount、delivery_fee、refund_amount、deduction_amount、payable_amount、paid_amount、status）、bill_items（账单明细，可下钻到订单）、payments（收付款记录，含凭证和发票号）。

系统：profiles（用户与角色）、notifications（消息）、audit_logs（操作日志，含 before_value、after_value、reason）。

【核心业务规则，必须真正实现】

1）门店与供应商绑定：关系为「门店 + 区域 + 品类 + 主供应商 + 备用供应商 + 生效时间」。同门店同品类只能有一家主供应商，可另配一家备用，主备不能相同。保存前校验门店区域、供应商区域与品类能力、合作状态、生效时间是否重叠。修改绑定必须填写原因并留痕，只影响新订单，历史订单不回溯改变。

2）门店商品范围：门店端商品 = 本店当前有效绑定 × 该品类下已关联该供应商且在售的商品 × 当前有效价格版本。不出现其他区域供应商的商品，不做跨供应商比价。

3）自动拆单：门店提交后执行「读取门店区域 → 按品类分组 → 匹配主供应商 → 校验状态/资质/区域/供货/容量 → 生成子订单 → 通知供应商」。失败时依次尝试备用供应商，仍失败进入平台异常池并生成待办。保留一张主订单和多张子订单，门店只看主订单汇总状态，供应商只看自己的子订单。

4）价格与锁价：同一供应商同一商品同一价格版本对所有绑定门店统一展示。供应商只能维护自己的供货报价，价格由平台审核发布。下单时锁定 unit_price 与 price_version_id，之后调价不影响已提交订单。每次调价记录原价、新价、涨跌额、涨跌幅、原因、操作人、审核人、生效时间，可按周导出。

5）订单状态机：主订单 pending_confirm → splitting → in_progress → partial_done → done，异常进入 abnormal，可 cancelled；子订单 pending_accept → accepted → picking → delivering → delivered → accepted_by_store → done，异常分支 shortage / rejected / cancelled。

6）验收与对账：门店按子订单逐项验收，录入实际数量或实际称重重量，标记少货、多货、错货、破损、质量问题并上传照片。差异进入售后流程，平台判定责任方，形成补货、退货、退款或扣款。对账按账期汇总已完成订单，分别生成门店应收账单和供应商应付结算单，扣除缺货、退货、扣款后计算应付金额，支持线上确认、提出异议、登记收付款。

【页面清单】

平台管理后台：数据看板（今日订单数、订单金额、待接单、配送中、待验收、异常订单、缺货商品、待对账、价格变动提醒）；区域管理（区域树、配送日历、截止时间）；门店管理（门店列表、详情、门店用户、采购规则）；供应商管理（列表、资质与有效期、供应品类、配送区域、配送能力、账号管理）；品类与商品（品类树含报价周期与审核规则、商品列表、规格、供应商商品关联、上下架）；绑定管理（列表、新增编辑、批量绑定、导入导出、变更记录）；报价与价格（待审核报价、调价前后对比、涨跌幅预警、批量调价、价格版本历史、价格趋势图）；订单管理（多条件筛选、主订单+子订单时间线、手动改派、拆分合并、取消、补录线下订单）；验收与售后（异常订单池、差异记录、售后处理、责任判定）；对账结算（门店账单、供应商结算单、明细、确认与异议、收付款登记、导出）；报表（采购、供应商履约、价格分析、经营，支持导出 Excel）；系统设置（角色权限、消息模板、订单与报价规则、操作日志）。

门店端 H5：微信风格登录页；首页（门店名称、配送区域、待收货提醒、常购商品、价格更新提醒）；分类页（品类侧边栏 + 商品列表，显示价格、规格、起订量、供货状态）；商品详情；购物车（改数量、删除、金额小计、起订量/缺货/配送日期提示）；确认订单（配送日期时间段、地址、备注、附件、金额明细、提交）；订单列表与详情（主订单状态、子订单分组、时间线、再来一单）；验收页（逐项录入实际数量/重量、标记差异、上传照片）；售后页；我的（历史订单、常购清单、本期账单、账单确认与异议）。

供应商工作台：工作台首页（待接单、待备货、配送中、异常提醒）；订单列表与详情（只显示自己的子订单，含门店、配送地址、日期、商品明细）；接单操作（接单、拒单填原因、部分接单、标记缺货、申请改派）；备货（拣货清单、打印、录入实际数量与重量、标记完成）；配送（人员车辆、预计到达、凭证、标记已送达）；报价管理（待报价任务、单个修改、批量填写、下载模板、Excel 导入、提交审核、查看驳回原因）；报价历史与结算单（历史价格、对账单、确认与申诉）。

【演示数据要求】（必须生成，保证打开就有内容）

区域：上海市，下辖松江区域、市区区域。门店 7 家（松江 3 家、市区 4 家）。供应商 5 家：松江蔬菜供应商、市区蔬菜供应商、肉类供应商、冻品供应商、一次性用品供应商，含营业执照号与有效期。品类 8 个：蔬菜、肉类、水产、海鲜、冻品、米面粮油、调味品、一次性用品，其中蔬菜/肉类/海鲜为每周报价且需审核，海鲜允许每日报价。商品 40 个，每个品类 5 个左右，含规格、单位、起订量，肉类和海鲜标注为称重商品。绑定关系覆盖 7 家门店 × 主要品类，部分品类配置备用供应商。每个商品至少两个价格版本，其中一个为本周新价，能看到涨跌。20 张历史订单，覆盖已完成、配送中、待接单、异常缺货。2 个账期的门店账单与供应商结算单。

【视觉风格】

主色 #0053b8，深色 #073765，背景 #f4f7fb，卡片白色、圆角 14px、浅灰边框 #dce5f0。侧边导航深蓝渐变，选中项浅色高亮。表格无竖向边框、浅色分割线，表头浅蓝底。状态用彩色胶囊标签：待处理蓝、配送中青、已完成绿、异常橙、取消灰。数字等宽字体，金额右对齐。

【一期范围】

必须包含：基础档案、绑定关系、自动拆单、门店下单、供应商接单与配送、报价与价格审核、价格历史、验收与售后、双向对账、基础报表、权限与日志。

暂不实现：在线支付、发票管理、司机端与路线规划、库存与仓库管理、ERP 与财务系统对接、多品牌多公司隔离、供应商竞价。

【执行顺序，请按批次实现并保持应用始终可运行】

第 1 批：Supabase 建表 + 种子数据 + 登录与角色路由 + 三端布局骨架

第 2 批：区域、门店、供应商、品类、商品、供应商商品关联

第 3 批：绑定管理 + 门店端商品范围按绑定过滤

第 4 批：报价任务、报价导入、审核、价格版本、门店价格展示与锁价

第 5 批：门店下单 + 自动拆单 + 供应商接单、缺货、备货、配送

第 6 批：门店验收、差异与售后、平台责任判定

第 7 批：双向对账、收付款登记、报表与导出

第 8 批：通知、操作日志、异常订单池完善

要求：每个页面都要有真实可用的数据和交互，不要留空白页和 TODO 占位；表格支持筛选、排序和分页；关键操作要有二次确认和成功提示；金额计算必须准确。

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d7f895f8-2f8b-4667-96e7-c615d0be4f4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
