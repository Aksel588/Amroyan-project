export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          canonical_url: string | null
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string
          featured: boolean
          featured_image: string | null
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          published: boolean
          read_time: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          canonical_url?: string | null
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          excerpt: string
          featured?: boolean
          featured_image?: string | null
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          read_time?: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          canonical_url?: string | null
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          featured?: boolean
          featured_image?: string | null
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          read_time?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      calculator_rates: {
        Row: {
          calculator_id: string
          created_at: string
          effective_from: string | null
          effective_to: string | null
          id: string
          label: string
          rate: number
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          calculator_id: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          label: string
          rate: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          calculator_id?: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          label?: string
          rate?: number
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "calculator_rates_calculator_id_fkey"
            columns: ["calculator_id"]
            isOneToOne: false
            referencedRelation: "calculators"
            referencedColumns: ["id"]
          },
        ]
      }
      calculators: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          service: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          service?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
          subject?: string
        }
        Relationships: []
      }
      course_applications: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string
          processed_by: string | null
          status: string
          submitted_from: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          processed_by?: string | null
          status?: string
          submitted_from?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          processed_by?: string | null
          status?: string
          submitted_from?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          description: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_published: boolean | null
          mime_type: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          view_count: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          mime_type?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean | null
          mime_type?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
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
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      increment_document_view_count: {
        Args: { document_id: string }
        Returns: undefined
      }
    }
    Enums: {
      document_category:
        | "standards"
        | "pek_notifications"
        | "clarifications_tax"
        | "clarifications_labor"
        | "discussions"
        | "tests_accounting_finance"
        | "tests_hr"
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
      document_category: [
        "standards",
        "pek_notifications",
        "clarifications_tax",
        "clarifications_labor",
        "discussions",
        "tests_accounting_finance",
        "tests_hr",
      ],
    },
  },
} as const
