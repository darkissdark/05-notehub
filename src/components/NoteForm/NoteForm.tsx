import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";
import { useQueryClient } from "@tanstack/react-query";

interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>().oneOf(tags).required("Required"),
});

const NoteForm = ({ onSuccess, onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  return (
    <Formik<{
      title: string;
      content: string;
      tag: NoteTag;
    }>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await createNote(values);
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          resetForm();
          onSuccess();
        } catch (e) {
          console.error(e);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        isSubmitting,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
      }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className={css.input}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span className={css.error}>{touched.title && errors.title}</span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span className={css.error}>
              {touched.content && errors.content}
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              className={css.select}
              value={values.tag}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <span className={css.error}>{touched.tag && errors.tag}</span>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
