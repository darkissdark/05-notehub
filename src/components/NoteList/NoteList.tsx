import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import type { Note } from "../../types/note";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./NoteList.module.css";

interface NoteListProps {
  page?: number;
  perPage?: number;
  search?: string;
  onTotalPages?: (pages: number) => void;
}

function NoteList({
  page = 1,
  perPage = 12,
  search = "",
  onTotalPages,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", { page, perPage, search }],
    queryFn: async () => {
      const response = await fetchNotes({
        page,
        perPage,
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      return response;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  useEffect(() => {
    if (data && onTotalPages) {
      onTotalPages(data.totalPages);
    }
  }, [data, onTotalPages]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;
  if (!data?.notes.length) return null;

  return (
    <ul className={css.list}>
      {data.notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutate(note.id)}
              disabled={isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
