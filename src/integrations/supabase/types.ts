export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Police_Data_Allegations: {
        Row: {
          allegation_id: number
          category: string | null
          complaint_id: number | null
          finding: string | null
          outcome: string | null
          subcategory: string | null
        }
        Insert: {
          allegation_id: number
          category?: string | null
          complaint_id?: number | null
          finding?: string | null
          outcome?: string | null
          subcategory?: string | null
        }
        Update: {
          allegation_id?: number
          category?: string | null
          complaint_id?: number | null
          finding?: string | null
          outcome?: string | null
          subcategory?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Allegations_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
        ]
      }
      Police_Data_Attachments: {
        Row: {
          attachment_id: number
          complaint_id: number | null
          created_at: string
          description: string | null
          file_url: string | null
          officer_id: number | null
          updated_at: string | null
        }
        Insert: {
          attachment_id?: number
          complaint_id?: number | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          officer_id?: number | null
          updated_at?: string | null
        }
        Update: {
          attachment_id?: number
          complaint_id?: number | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          officer_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Attachments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "Police_Data_Attachments_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Awards: {
        Row: {
          award_date: string | null
          award_id: number
          award_type: string | null
          description: string | null
          officer_id: number | null
        }
        Insert: {
          award_date?: string | null
          award_id: number
          award_type?: string | null
          description?: string | null
          officer_id?: number | null
        }
        Update: {
          award_date?: string | null
          award_id?: number
          award_type?: string | null
          description?: string | null
          officer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Awards_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Complainants: {
        Row: {
          age: number | null
          anonymized_name: string | null
          complainant_id: number
          complaint_id: number | null
          gender: string | null
          race: string | null
          type: string | null
        }
        Insert: {
          age?: number | null
          anonymized_name?: string | null
          complainant_id: number
          complaint_id?: number | null
          gender?: string | null
          race?: string | null
          type?: string | null
        }
        Update: {
          age?: number | null
          anonymized_name?: string | null
          complainant_id?: number
          complaint_id?: number | null
          gender?: string | null
          race?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Complainants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
        ]
      }
      Police_Data_Complaint_Complainant_Link: {
        Row: {
          complainant_id: number | null
          complainant_role: string | null
          complaint_complainant_id: number
          complaint_id: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          complainant_id?: number | null
          complainant_role?: string | null
          complaint_complainant_id?: number
          complaint_id?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          complainant_id?: number | null
          complainant_role?: string | null
          complaint_complainant_id?: number
          complaint_id?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Complaint_Complainant_Link_complainant_id_fkey"
            columns: ["complainant_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complainants"
            referencedColumns: ["complainant_id"]
          },
          {
            foreignKeyName: "Police_Data_Complaint_Complainant_Link_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
        ]
      }
      Police_Data_Complaints: {
        Row: {
          complaint_date: string | null
          complaint_id: number
          complaint_type: string | null
          final_finding: string | null
          final_outcome: string | null
          incident_date: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          officer_id: number | null
        }
        Insert: {
          complaint_date?: string | null
          complaint_id: number
          complaint_type?: string | null
          final_finding?: string | null
          final_outcome?: string | null
          incident_date?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          officer_id?: number | null
        }
        Update: {
          complaint_date?: string | null
          complaint_id?: number
          complaint_type?: string | null
          final_finding?: string | null
          final_outcome?: string | null
          incident_date?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          officer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Complaints_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Documents: {
        Row: {
          complaint_id: number | null
          created_at: string
          description: string | null
          doc_title: string
          doc_type: string | null
          document_id: number
          file_url: string | null
          lawsuit_id: number | null
          officer_id: number | null
          updated_at: string | null
        }
        Insert: {
          complaint_id?: number | null
          created_at?: string
          description?: string | null
          doc_title: string
          doc_type?: string | null
          document_id?: number
          file_url?: string | null
          lawsuit_id?: number | null
          officer_id?: number | null
          updated_at?: string | null
        }
        Update: {
          complaint_id?: number | null
          created_at?: string
          description?: string | null
          doc_title?: string
          doc_type?: string | null
          document_id?: number
          file_url?: string | null
          lawsuit_id?: number | null
          officer_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "Police_Data_Documents_lawsuit_id_fkey"
            columns: ["lawsuit_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Lawsuits"
            referencedColumns: ["lawsuit_id"]
          },
          {
            foreignKeyName: "Police_Data_Documents_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Investigation_Outcomes: {
        Row: {
          complaint_id: number | null
          created_at: string
          final_finding: string | null
          final_outcome: string | null
          finding_date: string | null
          outcome_id: number
          phase_name: string | null
          updated_at: string | null
        }
        Insert: {
          complaint_id?: number | null
          created_at?: string
          final_finding?: string | null
          final_outcome?: string | null
          finding_date?: string | null
          outcome_id?: number
          phase_name?: string | null
          updated_at?: string | null
        }
        Update: {
          complaint_id?: number | null
          created_at?: string
          final_finding?: string | null
          final_outcome?: string | null
          finding_date?: string | null
          outcome_id?: number
          phase_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Investigation_Outcomes_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
        ]
      }
      Police_Data_Lawsuit_Officer_Link: {
        Row: {
          allegation_in_lawsuit: string | null
          created_at: string
          lawsuit_id: number | null
          lawsuit_officer_link_id: number
          officer_id: number | null
          updated_at: string | null
        }
        Insert: {
          allegation_in_lawsuit?: string | null
          created_at?: string
          lawsuit_id?: number | null
          lawsuit_officer_link_id?: number
          officer_id?: number | null
          updated_at?: string | null
        }
        Update: {
          allegation_in_lawsuit?: string | null
          created_at?: string
          lawsuit_id?: number | null
          lawsuit_officer_link_id?: number
          officer_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Lawsuit_Officer_Link_lawsuit_id_fkey"
            columns: ["lawsuit_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Lawsuits"
            referencedColumns: ["lawsuit_id"]
          },
          {
            foreignKeyName: "Police_Data_Lawsuit_Officer_Link_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Lawsuits: {
        Row: {
          case_number: string | null
          court_name: string | null
          created_at: string
          date_closed: string | null
          date_filed: string | null
          final_outcome: string | null
          lawsuit_id: number
          lawsuit_status: string | null
          plaintiff_name: string | null
          settlement_amount: number | null
          Summary: string | null
          updated_at: string | null
        }
        Insert: {
          case_number?: string | null
          court_name?: string | null
          created_at?: string
          date_closed?: string | null
          date_filed?: string | null
          final_outcome?: string | null
          lawsuit_id?: number
          lawsuit_status?: string | null
          plaintiff_name?: string | null
          settlement_amount?: number | null
          Summary?: string | null
          updated_at?: string | null
        }
        Update: {
          case_number?: string | null
          court_name?: string | null
          created_at?: string
          date_closed?: string | null
          date_filed?: string | null
          final_outcome?: string | null
          lawsuit_id?: number
          lawsuit_status?: string | null
          plaintiff_name?: string | null
          settlement_amount?: number | null
          Summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Police_Data_Officer_Allegation_Link: {
        Row: {
          allegation_id: number | null
          created_at: string
          officer_allegation_link_id: number
          officer_id: number | null
          role_in_allegation: string | null
          updated_at: string | null
        }
        Insert: {
          allegation_id?: number | null
          created_at?: string
          officer_allegation_link_id?: number
          officer_id?: number | null
          role_in_allegation?: string | null
          updated_at?: string | null
        }
        Update: {
          allegation_id?: number | null
          created_at?: string
          officer_allegation_link_id?: number
          officer_id?: number | null
          role_in_allegation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Officer_Allegation_Link_allegation_id_fkey"
            columns: ["allegation_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Allegations"
            referencedColumns: ["allegation_id"]
          },
          {
            foreignKeyName: "Police_Data_Officer_Allegation_Link_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Officer_Complaint_Link: {
        Row: {
          complaint_id: number | null
          created_at: string
          date_involved: string | null
          officer_complaint_link_id: number
          officer_id: number | null
          role_in_incident: string | null
          updated_at: string | null
        }
        Insert: {
          complaint_id?: number | null
          created_at?: string
          date_involved?: string | null
          officer_complaint_link_id?: number
          officer_id?: number | null
          role_in_incident?: string | null
          updated_at?: string | null
        }
        Update: {
          complaint_id?: number | null
          created_at?: string
          date_involved?: string | null
          officer_complaint_link_id?: number
          officer_id?: number | null
          role_in_incident?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Officer_Complaint_Link_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "Police_Data_Officer_Complaint_Link_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Officer_Rank_History: {
        Row: {
          created_at: string
          end_date: string | null
          officer_id: number | null
          rank_history_id: number
          rank_name: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          officer_id?: number | null
          rank_history_id?: number
          rank_name?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          officer_id?: number | null
          rank_history_id?: number
          rank_name?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Officer_Rank_History_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Officer_Unit_History: {
        Row: {
          end_date: string | null
          id: number
          officer_id: number | null
          start_date: string | null
          unit_name: string | null
        }
        Insert: {
          end_date?: string | null
          id: number
          officer_id?: number | null
          start_date?: string | null
          unit_name?: string | null
        }
        Update: {
          end_date?: string | null
          id?: number
          officer_id?: number | null
          start_date?: string | null
          unit_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Officer_Unit_History_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
      Police_Data_Officers: {
        Row: {
          active_status: string | null
          badge_number: number | null
          current_rank: string | null
          date_appointed: string | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          last_name: string | null
          middle_initial: string | null
          officer_id: number
          race: string | null
          Salary: number | null
        }
        Insert: {
          active_status?: string | null
          badge_number?: number | null
          current_rank?: string | null
          date_appointed?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          middle_initial?: string | null
          officer_id: number
          race?: string | null
          Salary?: number | null
        }
        Update: {
          active_status?: string | null
          badge_number?: number | null
          current_rank?: string | null
          date_appointed?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          middle_initial?: string | null
          officer_id?: number
          race?: string | null
          Salary?: number | null
        }
        Relationships: []
      }
      Police_Data_Use_Of_Use: {
        Row: {
          complaint_id: number | null
          description: string | null
          force_type: string | null
          incident_date: string | null
          officer_id: number | null
          subject_fatality: boolean | null
          subject_injured: boolean | null
          use_of_force_id: number
        }
        Insert: {
          complaint_id?: number | null
          description?: string | null
          force_type?: string | null
          incident_date?: string | null
          officer_id?: number | null
          subject_fatality?: boolean | null
          subject_injured?: boolean | null
          use_of_force_id: number
        }
        Update: {
          complaint_id?: number | null
          description?: string | null
          force_type?: string | null
          incident_date?: string | null
          officer_id?: number | null
          subject_fatality?: boolean | null
          subject_injured?: boolean | null
          use_of_force_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Police_Data_Use_Of_Use_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "Police_Data_Use_Of_Use_officer_id_fkey"
            columns: ["officer_id"]
            isOneToOne: false
            referencedRelation: "Police_Data_Officers"
            referencedColumns: ["officer_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
