export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      daily_habit_completions: {
        Row: {
          completed_at: string | null;
          completion_count: number | null;
          completion_date: string;
          id: string;
          user_habit_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          completion_count?: number | null;
          completion_date: string;
          id?: string;
          user_habit_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          completion_count?: number | null;
          completion_date?: string;
          id?: string;
          user_habit_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_habit_completions_user_habit_id_fkey';
            columns: ['user_habit_id'];
            isOneToOne: false;
            referencedRelation: 'user_habits';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'daily_habit_completions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      daily_logs: {
        Row: {
          bmi: number | null;
          body_fat_percent: number | null;
          created_at: string | null;
          id: string;
          log_date: string;
          logged_at: string | null;
          muscle_mass_kg: number | null;
          notes: string | null;
          user_id: string;
          weight_kg: number | null;
        };
        Insert: {
          bmi?: number | null;
          body_fat_percent?: number | null;
          created_at?: string | null;
          id?: string;
          log_date: string;
          logged_at?: string | null;
          muscle_mass_kg?: number | null;
          notes?: string | null;
          user_id: string;
          weight_kg?: number | null;
        };
        Update: {
          bmi?: number | null;
          body_fat_percent?: number | null;
          created_at?: string | null;
          id?: string;
          log_date?: string;
          logged_at?: string | null;
          muscle_mass_kg?: number | null;
          notes?: string | null;
          user_id?: string;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_logs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      habit_presets: {
        Row: {
          category: string;
          created_at: string | null;
          default_daily_target: number | null;
          description: string | null;
          icon: string;
          id: string;
          is_active: boolean | null;
          name: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          default_daily_target?: number | null;
          description?: string | null;
          icon: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          default_daily_target?: number | null;
          description?: string | null;
          icon?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
        };
        Relationships: [];
      };
      habit_streaks: {
        Row: {
          current_streak: number | null;
          habit_type: string;
          id: string;
          last_updated: string | null;
          longest_streak: number | null;
          user_habit_id: string | null;
          user_id: string;
        };
        Insert: {
          current_streak?: number | null;
          habit_type: string;
          id?: string;
          last_updated?: string | null;
          longest_streak?: number | null;
          user_habit_id?: string | null;
          user_id: string;
        };
        Update: {
          current_streak?: number | null;
          habit_type?: string;
          id?: string;
          last_updated?: string | null;
          longest_streak?: number | null;
          user_habit_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'habit_streaks_user_habit_id_fkey';
            columns: ['user_habit_id'];
            isOneToOne: false;
            referencedRelation: 'user_habits';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'habit_streaks_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          display_name: string | null;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          display_name?: string | null;
          email: string;
          id: string;
        };
        Update: {
          created_at?: string | null;
          display_name?: string | null;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      progress_photos: {
        Row: {
          body_fat_at_time: number | null;
          id: string;
          photo_url: string;
          taken_at: string | null;
          user_id: string;
          weight_at_time: number | null;
        };
        Insert: {
          body_fat_at_time?: number | null;
          id?: string;
          photo_url: string;
          taken_at?: string | null;
          user_id: string;
          weight_at_time?: number | null;
        };
        Update: {
          body_fat_at_time?: number | null;
          id?: string;
          photo_url?: string;
          taken_at?: string | null;
          user_id?: string;
          weight_at_time?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'progress_photos_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_habits: {
        Row: {
          created_at: string | null;
          custom_icon: string | null;
          custom_name: string | null;
          daily_target: number | null;
          display_order: number | null;
          habit_preset_id: string | null;
          id: string;
          is_active: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          custom_icon?: string | null;
          custom_name?: string | null;
          daily_target?: number | null;
          display_order?: number | null;
          habit_preset_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          custom_icon?: string | null;
          custom_name?: string | null;
          daily_target?: number | null;
          display_order?: number | null;
          habit_preset_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_habits_habit_preset_id_fkey';
            columns: ['habit_preset_id'];
            isOneToOne: false;
            referencedRelation: 'habit_presets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_habits_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          auth_user_id: string;
          birth_date: string | null;
          created_at: string | null;
          gender: string | null;
          height_cm: number | null;
          id: string;
          onboarding_completed: boolean | null;
          starting_weight_kg: number | null;
          target_date: string | null;
          target_weight_kg: number | null;
        };
        Insert: {
          auth_user_id: string;
          birth_date?: string | null;
          created_at?: string | null;
          gender?: string | null;
          height_cm?: number | null;
          id?: string;
          onboarding_completed?: boolean | null;
          starting_weight_kg?: number | null;
          target_date?: string | null;
          target_weight_kg?: number | null;
        };
        Update: {
          auth_user_id?: string;
          birth_date?: string | null;
          created_at?: string | null;
          gender?: string | null;
          height_cm?: number | null;
          id?: string;
          onboarding_completed?: boolean | null;
          starting_weight_kg?: number | null;
          target_date?: string | null;
          target_weight_kg?: number | null;
        };
        Relationships: [];
      };
      vision_board_items: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          item_order: number | null;
          theme: string | null;
          title: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          item_order?: number | null;
          theme?: string | null;
          title?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          item_order?: number | null;
          theme?: string | null;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vision_board_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_id_from_auth: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
