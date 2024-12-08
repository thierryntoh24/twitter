"use server";

import { createClient } from "@/utils/supabase/server";
import { Trending } from "./types";

export const fetchTrending = async (from: number = 0, to: number = 2) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trending_topics")
      .select()
      .range(from, to);

    if (error) {
      throw error;
    }

    return data as Trending[];
  } catch (error) {
    throw error;
  }
};
