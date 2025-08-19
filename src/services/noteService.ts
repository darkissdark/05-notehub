import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<AxiosResponse<FetchNotesResponse>> => {
  return api.get("", { params });
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (
  data: CreateNoteParams
): Promise<AxiosResponse<Note>> => {
  return api.post("", data);
};

export const deleteNote = async (id: string): Promise<AxiosResponse<Note>> => {
  return api.delete(`/${id}`);
};
