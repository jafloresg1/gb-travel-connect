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
      catalog_departures: {
        Row: {
          availability: string | null
          created_at: string
          currency: string
          departure_city: string | null
          end_date: string | null
          id: string
          notes: string | null
          price_base: number | null
          program_id: string
          start_date: string
          supplement: number | null
          taxes: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          currency?: string
          departure_city?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          price_base?: number | null
          program_id: string
          start_date: string
          supplement?: number | null
          taxes?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          currency?: string
          departure_city?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          price_base?: number | null
          program_id?: string
          start_date?: string
          supplement?: number | null
          taxes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_departures_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "catalog_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_program_internal: {
        Row: {
          internal_notes: string | null
          operator: string | null
          operator_code: string | null
          operator_url: string | null
          program_id: string
          updated_at: string
        }
        Insert: {
          internal_notes?: string | null
          operator?: string | null
          operator_code?: string | null
          operator_url?: string | null
          program_id: string
          updated_at?: string
        }
        Update: {
          internal_notes?: string | null
          operator?: string | null
          operator_code?: string | null
          operator_url?: string | null
          program_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_program_internal_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: true
            referencedRelation: "catalog_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_program_promotions: {
        Row: {
          badge: string | null
          program_id: string
          promo_notes: string | null
          promo_price: number | null
          promotion_id: string
        }
        Insert: {
          badge?: string | null
          program_id: string
          promo_notes?: string | null
          promo_price?: number | null
          promotion_id: string
        }
        Update: {
          badge?: string | null
          program_id?: string
          promo_notes?: string | null
          promo_price?: number | null
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_program_promotions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "catalog_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_program_promotions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "catalog_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_programs: {
        Row: {
          cities: string[]
          countries: string[]
          created_at: string
          currency: string
          days: number | null
          departure_city: string | null
          gallery: string[]
          highlights: string[]
          id: string
          image_url: string | null
          includes: string[]
          includes_flight: boolean
          is_published: boolean
          itinerary: Json
          nights: number | null
          not_includes: string[]
          price_from: number | null
          region: string
          room_basis: string
          slug: string
          sort_order: number
          summary: string | null
          tags: string[]
          taxes_from: number | null
          title: string
          updated_at: string
        }
        Insert: {
          cities?: string[]
          countries?: string[]
          created_at?: string
          currency?: string
          days?: number | null
          departure_city?: string | null
          gallery?: string[]
          highlights?: string[]
          id?: string
          image_url?: string | null
          includes?: string[]
          includes_flight?: boolean
          is_published?: boolean
          itinerary?: Json
          nights?: number | null
          not_includes?: string[]
          price_from?: number | null
          region: string
          room_basis?: string
          slug: string
          sort_order?: number
          summary?: string | null
          tags?: string[]
          taxes_from?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          cities?: string[]
          countries?: string[]
          created_at?: string
          currency?: string
          days?: number | null
          departure_city?: string | null
          gallery?: string[]
          highlights?: string[]
          id?: string
          image_url?: string | null
          includes?: string[]
          includes_flight?: boolean
          is_published?: boolean
          itinerary?: Json
          nights?: number | null
          not_includes?: string[]
          price_from?: number | null
          region?: string
          room_basis?: string
          slug?: string
          sort_order?: number
          summary?: string | null
          tags?: string[]
          taxes_from?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      catalog_promotions: {
        Row: {
          clauses: string | null
          created_at: string
          deposit_text: string | null
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          slug: string
          title: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          clauses?: string | null
          created_at?: string
          deposit_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          clauses?: string | null
          created_at?: string
          deposit_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          adultos: number
          ajustes: string[] | null
          bebes: number
          campana: string
          comentario_cambio: string | null
          correo: string | null
          created_at: string
          destino: string | null
          edades_menores: number[] | null
          estado: string
          estilos: string[] | null
          fecha_regreso: string | null
          fecha_salida: string | null
          flexibilidad: string[] | null
          fuente: string
          id: string
          menores: number
          mes_aprox: string | null
          metadata: Json
          moneda: string | null
          nivel_presupuesto: string | null
          nivel_sugerido: string | null
          nombre: string | null
          origen: string | null
          otro_destino: string | null
          otro_origen: string | null
          preferencia_contacto: string | null
          prioridad: string | null
          quincena: string | null
          respuesta_cliente: string | null
          resultado_descripcion: string | null
          resultado_incluye: string[] | null
          resultado_titulo: string | null
          resumen: string | null
          servicio: string | null
          tipo_fechas: string | null
          urgencia: string | null
          whatsapp: string | null
        }
        Insert: {
          adultos?: number
          ajustes?: string[] | null
          bebes?: number
          campana?: string
          comentario_cambio?: string | null
          correo?: string | null
          created_at?: string
          destino?: string | null
          edades_menores?: number[] | null
          estado?: string
          estilos?: string[] | null
          fecha_regreso?: string | null
          fecha_salida?: string | null
          flexibilidad?: string[] | null
          fuente?: string
          id?: string
          menores?: number
          mes_aprox?: string | null
          metadata?: Json
          moneda?: string | null
          nivel_presupuesto?: string | null
          nivel_sugerido?: string | null
          nombre?: string | null
          origen?: string | null
          otro_destino?: string | null
          otro_origen?: string | null
          preferencia_contacto?: string | null
          prioridad?: string | null
          quincena?: string | null
          respuesta_cliente?: string | null
          resultado_descripcion?: string | null
          resultado_incluye?: string[] | null
          resultado_titulo?: string | null
          resumen?: string | null
          servicio?: string | null
          tipo_fechas?: string | null
          urgencia?: string | null
          whatsapp?: string | null
        }
        Update: {
          adultos?: number
          ajustes?: string[] | null
          bebes?: number
          campana?: string
          comentario_cambio?: string | null
          correo?: string | null
          created_at?: string
          destino?: string | null
          edades_menores?: number[] | null
          estado?: string
          estilos?: string[] | null
          fecha_regreso?: string | null
          fecha_salida?: string | null
          flexibilidad?: string[] | null
          fuente?: string
          id?: string
          menores?: number
          mes_aprox?: string | null
          metadata?: Json
          moneda?: string | null
          nivel_presupuesto?: string | null
          nivel_sugerido?: string | null
          nombre?: string | null
          origen?: string | null
          otro_destino?: string | null
          otro_origen?: string | null
          preferencia_contacto?: string | null
          prioridad?: string | null
          quincena?: string | null
          respuesta_cliente?: string | null
          resultado_descripcion?: string | null
          resultado_incluye?: string[] | null
          resultado_titulo?: string | null
          resumen?: string | null
          servicio?: string | null
          tipo_fechas?: string | null
          urgencia?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "asesor"
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
      app_role: ["admin", "asesor"],
    },
  },
} as const
