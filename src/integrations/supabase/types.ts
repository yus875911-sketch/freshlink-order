export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acceptance_records: {
        Row: {
          created_at: string
          diff_qty: number
          diff_type: string | null
          id: string
          operator_id: string | null
          order_item_id: string
          ordered_qty: number
          photos: string[]
          quality_status: string
          received_qty: number
          remark: string | null
          sub_order_id: string
        }
        Insert: {
          created_at?: string
          diff_qty?: number
          diff_type?: string | null
          id?: string
          operator_id?: string | null
          order_item_id: string
          ordered_qty: number
          photos?: string[]
          quality_status?: string
          received_qty?: number
          remark?: string | null
          sub_order_id: string
        }
        Update: {
          created_at?: string
          diff_qty?: number
          diff_type?: string | null
          id?: string
          operator_id?: string | null
          order_item_id?: string
          ordered_qty?: number
          photos?: string[]
          quality_status?: string
          received_qty?: number
          remark?: string | null
          sub_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acceptance_records_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acceptance_records_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      after_sales: {
        Row: {
          created_at: string
          deduction_amount: number
          handled_at: string | null
          handled_by: string | null
          id: string
          order_item_id: string | null
          qty: number
          reason: string
          responsibility: string | null
          status: string
          store_id: string
          sub_order_id: string
          supplier_id: string
          type: string
        }
        Insert: {
          created_at?: string
          deduction_amount?: number
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          order_item_id?: string | null
          qty?: number
          reason?: string
          responsibility?: string | null
          status?: string
          store_id: string
          sub_order_id: string
          supplier_id: string
          type: string
        }
        Update: {
          created_at?: string
          deduction_amount?: number
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          order_item_id?: string | null
          qty?: number
          reason?: string
          responsibility?: string | null
          status?: string
          store_id?: string
          sub_order_id?: string
          supplier_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "after_sales_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "after_sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "after_sales_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "after_sales_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          after_value: Json | null
          before_value: Json | null
          created_at: string
          id: string
          module: string
          operator_id: string | null
          operator_name: string
          reason: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          id?: string
          module: string
          operator_id?: string | null
          operator_name?: string
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          after_value?: Json | null
          before_value?: Json | null
          created_at?: string
          id?: string
          module?: string
          operator_id?: string | null
          operator_name?: string
          reason?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      bill_items: {
        Row: {
          amount: number
          bill_id: string
          deduction_amount: number
          delivery_date: string | null
          id: string
          order_id: string | null
          order_no: string
          refund_amount: number
          remark: string | null
          sub_order_id: string | null
        }
        Insert: {
          amount?: number
          bill_id: string
          deduction_amount?: number
          delivery_date?: string | null
          id?: string
          order_id?: string | null
          order_no?: string
          refund_amount?: number
          remark?: string | null
          sub_order_id?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string
          deduction_amount?: number
          delivery_date?: string | null
          id?: string
          order_id?: string | null
          order_no?: string
          refund_amount?: number
          remark?: string | null
          sub_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          bill_no: string
          confirmed_at: string | null
          created_at: string
          deduction_amount: number
          delivery_fee: number
          dispute_reason: string | null
          id: string
          order_amount: number
          paid_amount: number
          payable_amount: number
          period_end: string
          period_start: string
          refund_amount: number
          status: string
          target_id: string
          type: string
          updated_at: string
        }
        Insert: {
          bill_no: string
          confirmed_at?: string | null
          created_at?: string
          deduction_amount?: number
          delivery_fee?: number
          dispute_reason?: string | null
          id?: string
          order_amount?: number
          paid_amount?: number
          payable_amount?: number
          period_end: string
          period_start: string
          refund_amount?: number
          status?: string
          target_id: string
          type: string
          updated_at?: string
        }
        Update: {
          bill_no?: string
          confirmed_at?: string | null
          created_at?: string
          deduction_amount?: number
          delivery_fee?: number
          dispute_reason?: string | null
          id?: string
          order_amount?: number
          paid_amount?: number
          payable_amount?: number
          period_end?: string
          period_start?: string
          refund_amount?: number
          status?: string
          target_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          need_approval: boolean
          parent_id: string | null
          price_alert_percent: number
          quote_cycle: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          need_approval?: boolean
          parent_id?: string | null
          price_alert_percent?: number
          quote_cycle?: string
          sort_order?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          need_approval?: boolean
          parent_id?: string | null
          price_alert_percent?: number
          quote_cycle?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_accounts: {
        Row: {
          email: string
          id: string
          label: string
          password: string
          role: Database["public"]["Enums"]["app_role"]
          sort_order: number
          store_id: string | null
          supplier_id: string | null
        }
        Insert: {
          email: string
          id?: string
          label: string
          password: string
          role: Database["public"]["Enums"]["app_role"]
          sort_order?: number
          store_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          label?: string
          password?: string
          role?: Database["public"]["Enums"]["app_role"]
          sort_order?: number
          store_id?: string | null
          supplier_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          audience: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          target_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          audience?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          target_id?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          audience?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          target_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_assign_logs: {
        Row: {
          created_at: string
          from_supplier_id: string | null
          id: string
          operator_id: string | null
          operator_name: string
          reason: string
          sub_order_id: string
          to_supplier_id: string
        }
        Insert: {
          created_at?: string
          from_supplier_id?: string | null
          id?: string
          operator_id?: string | null
          operator_name?: string
          reason?: string
          sub_order_id: string
          to_supplier_id: string
        }
        Update: {
          created_at?: string
          from_supplier_id?: string | null
          id?: string
          operator_id?: string | null
          operator_name?: string
          reason?: string
          sub_order_id?: string
          to_supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_assign_logs_from_supplier_id_fkey"
            columns: ["from_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_assign_logs_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_assign_logs_to_supplier_id_fkey"
            columns: ["to_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          price_version_id: string | null
          product_id: string
          qty: number
          status: string
          sub_order_id: string | null
          supplier_id: string
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          price_version_id?: string | null
          product_id: string
          qty: number
          status?: string
          sub_order_id?: string | null
          supplier_id: string
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          price_version_id?: string | null
          product_id?: string
          qty?: number
          status?: string
          sub_order_id?: string | null
          supplier_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_price_version_id_fkey"
            columns: ["price_version_id"]
            isOneToOne: false
            referencedRelation: "price_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_logs: {
        Row: {
          created_at: string
          from_status: string | null
          id: string
          operator_id: string | null
          operator_name: string
          order_id: string | null
          remark: string | null
          sub_order_id: string | null
          to_status: string
        }
        Insert: {
          created_at?: string
          from_status?: string | null
          id?: string
          operator_id?: string | null
          operator_name?: string
          order_id?: string | null
          remark?: string | null
          sub_order_id?: string | null
          to_status: string
        }
        Update: {
          created_at?: string
          from_status?: string | null
          id?: string
          operator_id?: string | null
          operator_name?: string
          order_id?: string | null
          remark?: string | null
          sub_order_id?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_logs_sub_order_id_fkey"
            columns: ["sub_order_id"]
            isOneToOne: false
            referencedRelation: "sub_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string
          created_by: string | null
          delivery_date: string
          delivery_slot: string
          id: string
          order_no: string
          price_locked_at: string | null
          region_id: string
          remark: string | null
          status: string
          store_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          address?: string
          created_at?: string
          created_by?: string | null
          delivery_date: string
          delivery_slot?: string
          id?: string
          order_no: string
          price_locked_at?: string | null
          region_id: string
          remark?: string | null
          status?: string
          store_id: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string | null
          delivery_date?: string
          delivery_slot?: string
          id?: string
          order_no?: string
          price_locked_at?: string | null
          region_id?: string
          remark?: string | null
          status?: string
          store_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          direction: string
          id: string
          invoice_no: string | null
          method: string
          operator_id: string | null
          paid_at: string
          proof_url: string | null
          remark: string | null
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          direction: string
          id?: string
          invoice_no?: string | null
          method?: string
          operator_id?: string | null
          paid_at?: string
          proof_url?: string | null
          remark?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          direction?: string
          id?: string
          invoice_no?: string | null
          method?: string
          operator_id?: string | null
          paid_at?: string
          proof_url?: string | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      price_tasks: {
        Row: {
          category_id: string
          created_at: string
          due_date: string
          id: string
          period: string
          status: string
          supplier_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          due_date: string
          id?: string
          period: string
          status?: string
          supplier_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          due_date?: string
          id?: string
          period?: string
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_tasks_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      price_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          change_amount: number
          change_percent: number
          created_at: string
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          price: number
          price_task_id: string | null
          product_id: string
          reason: string | null
          source: string
          status: string
          supplier_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          change_amount?: number
          change_percent?: number
          created_at?: string
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          price: number
          price_task_id?: string | null
          product_id: string
          reason?: string | null
          source?: string
          status?: string
          supplier_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          change_amount?: number
          change_percent?: number
          created_at?: string
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          price?: number
          price_task_id?: string | null
          product_id?: string
          reason?: string | null
          source?: string
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_versions_price_task_id_fkey"
            columns: ["price_task_id"]
            isOneToOne: false
            referencedRelation: "price_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_versions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_versions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          code: string
          conversion: number
          created_at: string
          id: string
          image_url: string | null
          is_weighed: boolean
          name: string
          pack_unit: string
          spec: string
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          category_id: string
          code: string
          conversion?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_weighed?: boolean
          name: string
          pack_unit?: string
          spec?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          code?: string
          conversion?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_weighed?: boolean
          name?: string
          pack_unit?: string
          spec?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          store_id: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          is_active?: boolean
          phone?: string | null
          store_id?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          store_id?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string
          created_at: string
          cutoff_time: string
          delivery_days: number[]
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          cutoff_time?: string
          delivery_days?: number[]
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          cutoff_time?: string
          delivery_days?: number[]
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      store_supplier_bindings: {
        Row: {
          backup_supplier_id: string | null
          category_id: string
          change_reason: string | null
          created_at: string
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          primary_supplier_id: string
          region_id: string
          status: string
          store_id: string
          updated_at: string
        }
        Insert: {
          backup_supplier_id?: string | null
          category_id: string
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          primary_supplier_id: string
          region_id: string
          status?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          backup_supplier_id?: string | null
          category_id?: string
          change_reason?: string | null
          created_at?: string
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          primary_supplier_id?: string
          region_id?: string
          status?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_supplier_bindings_backup_supplier_id_fkey"
            columns: ["backup_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_supplier_bindings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_supplier_bindings_primary_supplier_id_fkey"
            columns: ["primary_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_supplier_bindings_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_supplier_bindings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          code: string
          contact_name: string
          contact_phone: string
          created_at: string
          credit_days: number
          id: string
          min_order_amount: number
          name: string
          region_id: string
          settlement_type: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string
          code: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          credit_days?: number
          id?: string
          min_order_amount?: number
          name: string
          region_id: string
          settlement_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          code?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          credit_days?: number
          id?: string
          min_order_amount?: number
          name?: string
          region_id?: string
          settlement_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_orders: {
        Row: {
          accept_deadline: string | null
          amount: number
          created_at: string
          delivery_person: string | null
          delivery_phone: string | null
          delivery_status: string | null
          eta: string | null
          id: string
          order_id: string
          proof_url: string | null
          reject_reason: string | null
          status: string
          sub_no: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          accept_deadline?: string | null
          amount?: number
          created_at?: string
          delivery_person?: string | null
          delivery_phone?: string | null
          delivery_status?: string | null
          eta?: string | null
          id?: string
          order_id: string
          proof_url?: string | null
          reject_reason?: string | null
          status?: string
          sub_no: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          accept_deadline?: string | null
          amount?: number
          created_at?: string
          delivery_person?: string | null
          delivery_phone?: string | null
          delivery_status?: string | null
          eta?: string | null
          id?: string
          order_id?: string
          proof_url?: string | null
          reject_reason?: string | null
          status?: string
          sub_no?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_products: {
        Row: {
          created_at: string
          id: string
          min_qty: number
          product_id: string
          supplier_id: string
          supplier_sku: string
          supply_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_qty?: number
          product_id: string
          supplier_id: string
          supplier_sku?: string
          supply_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_qty?: number
          product_id?: string
          supplier_id?: string
          supplier_sku?: string
          supply_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_regions: {
        Row: {
          daily_capacity: number
          id: string
          is_active: boolean
          region_id: string
          supplier_id: string
        }
        Insert: {
          daily_capacity?: number
          id?: string
          is_active?: boolean
          region_id: string
          supplier_id: string
        }
        Update: {
          daily_capacity?: number
          id?: string
          is_active?: boolean
          region_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_regions_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_regions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          code: string
          contact_name: string
          contact_phone: string
          created_at: string
          credit_days: number
          id: string
          license_expiry: string | null
          license_no: string
          name: string
          settlement_type: string
          status: string
          updated_at: string
          uscc: string
        }
        Insert: {
          code: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          credit_days?: number
          id?: string
          license_expiry?: string | null
          license_no?: string
          name: string
          settlement_type?: string
          status?: string
          updated_at?: string
          uscc?: string
        }
        Update: {
          code?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          credit_days?: number
          id?: string
          license_expiry?: string | null
          license_no?: string
          name?: string
          settlement_type?: string
          status?: string
          updated_at?: string
          uscc?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_see_bills: { Args: never; Returns: boolean }
      claim_demo_profile: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_platform: { Args: never; Returns: boolean }
      is_platform_manage: { Args: never; Returns: boolean }
      my_role: { Args: never; Returns: Database["public"]["Enums"]["app_role"] }
      my_store_id: { Args: never; Returns: string }
      my_supplier_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role:
        | "platform_admin"
        | "platform_ops"
        | "platform_finance"
        | "store_manager"
        | "store_buyer"
        | "supplier_admin"
        | "supplier_sales"
        | "supplier_delivery"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "platform_admin",
        "platform_ops",
        "platform_finance",
        "store_manager",
        "store_buyer",
        "supplier_admin",
        "supplier_sales",
        "supplier_delivery",
      ],
    },
  },
} as const
