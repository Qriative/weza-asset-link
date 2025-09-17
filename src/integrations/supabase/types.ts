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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          make: string | null
          model: string | null
          owner_user_id: string | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string | null
          value: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          make?: string | null
          model?: string | null
          owner_user_id?: string | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
          value?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          make?: string | null
          model?: string | null
          owner_user_id?: string | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
          value?: number | null
          year?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      credit_scores: {
        Row: {
          components: Json | null
          computed_at: string | null
          id: string
          model_version: string | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          components?: Json | null
          computed_at?: string | null
          id?: string
          model_version?: string | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          components?: Json | null
          computed_at?: string | null
          id?: string
          model_version?: string | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      digital_id_verifications: {
        Row: {
          afripay_id: string | null
          created_at: string | null
          documents: Json | null
          id: string
          status: Database["public"]["Enums"]["verification_status"] | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          afripay_id?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          afripay_id?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["verification_status"] | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          payload: Json | null
          reasons: string[] | null
          score: number | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          reasons?: string[] | null
          score?: number | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          reasons?: string[] | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          applicant_id: string | null
          application_data: Json | null
          asset_id: string | null
          assigned_lender_id: string | null
          created_at: string | null
          fraud_score: number | null
          id: string
          interest_rate: number | null
          requested_amount: number
          status: Database["public"]["Enums"]["application_status"] | null
          term_months: number
          updated_at: string | null
          wezascore: Json | null
        }
        Insert: {
          applicant_id?: string | null
          application_data?: Json | null
          asset_id?: string | null
          assigned_lender_id?: string | null
          created_at?: string | null
          fraud_score?: number | null
          id?: string
          interest_rate?: number | null
          requested_amount: number
          status?: Database["public"]["Enums"]["application_status"] | null
          term_months: number
          updated_at?: string | null
          wezascore?: Json | null
        }
        Update: {
          applicant_id?: string | null
          application_data?: Json | null
          asset_id?: string | null
          assigned_lender_id?: string | null
          created_at?: string | null
          fraud_score?: number | null
          id?: string
          interest_rate?: number | null
          requested_amount?: number
          status?: Database["public"]["Enums"]["application_status"] | null
          term_months?: number
          updated_at?: string | null
          wezascore?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          application_id: string | null
          created_at: string | null
          disbursed_amount: number | null
          disbursed_at: string | null
          id: string
          next_due_date: string | null
          outstanding_balance: number
          principal: number
          repayment_schedule: Json | null
          status: Database["public"]["Enums"]["loan_status"] | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          disbursed_amount?: number | null
          disbursed_at?: string | null
          id?: string
          next_due_date?: string | null
          outstanding_balance: number
          principal: number
          repayment_schedule?: Json | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          disbursed_amount?: number | null
          disbursed_at?: string | null
          id?: string
          next_due_date?: string | null
          outstanding_balance?: number
          principal?: number
          repayment_schedule?: Json | null
          status?: Database["public"]["Enums"]["loan_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          loan_id: string | null
          method: Database["public"]["Enums"]["payment_method"]
          raw_webhook_payload: Json | null
          received_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          loan_id?: string | null
          method: Database["public"]["Enums"]["payment_method"]
          raw_webhook_payload?: Json | null
          received_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          loan_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          raw_webhook_payload?: Json | null
          received_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_provider: Database["public"]["Enums"]["auth_provider"] | null
          city: string | null
          country: string | null
          created_at: string | null
          dob: string | null
          first_name: string | null
          id: string
          is_verified: boolean | null
          language: string | null
          last_name: string | null
          national_id: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          language?: string | null
          last_name?: string | null
          national_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          dob?: string | null
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          language?: string | null
          last_name?: string | null
          national_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "agent" | "lender" | "admin" | "superadmin"
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "disbursed"
        | "rejected"
        | "closed"
      asset_type: "vehicle" | "equipment" | "property" | "machinery"
      auth_provider: "email" | "google" | "twitter" | "github" | "phone"
      loan_status: "active" | "delinquent" | "closed" | "written_off"
      payment_method: "mpesa" | "airtel" | "bank_transfer" | "card" | "manual"
      payment_status: "pending" | "success" | "failed"
      verification_status: "pending" | "verified" | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["user", "agent", "lender", "admin", "superadmin"],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "disbursed",
        "rejected",
        "closed",
      ],
      asset_type: ["vehicle", "equipment", "property", "machinery"],
      auth_provider: ["email", "google", "twitter", "github", "phone"],
      loan_status: ["active", "delinquent", "closed", "written_off"],
      payment_method: ["mpesa", "airtel", "bank_transfer", "card", "manual"],
      payment_status: ["pending", "success", "failed"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
