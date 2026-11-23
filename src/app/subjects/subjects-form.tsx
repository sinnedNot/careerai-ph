
"use client";

import { useActionState, useState, useTransition } from "react";
import {
  addSubject,
  updateSubject,
  deleteSubject,
  type SubjectState,
} from "./actions";

type Subject = {
  id: string;
  subject_name: string;
  current_topics: string[];
  created_at: string;
};

type Props = {
  initialSubjects: Subject[];
};

const initialState: SubjectState = {};

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

const editInputClassName =
  "mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

export default function SubjectsForm({ initialSubjects }: Props) {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [topics, setTopics] = useState([""]);
  const [state, formAction, isPending] = useActionState(
    addSubject,
    initialState
  );
  const [isWorking, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  function updateTopic(index: number, value: string) {
    setTopics((current) =>
      current.map((topic, i) => (i === index ? value : topic))
    );
  }

  function addTopicField() {
    setTopics((current) => [...current, ""]);
  }

  function removeTopicField(index: number) {
    setTopics((current) => current.filter((_, i) => i !== index));
  }

  function handleUpdate(
    event: React.FormEvent<HTMLFormElement>,
    subjectId: string
  ) {
    event.preventDefault();
    setEditError("");
    setEditSuccess("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateSubject(subjectId, formData);

      if (result.error) {
        setEditError(result.error);
        return;
      }

      const updatedName = String(formData.get("subjectName")).trim();
      const updatedTopics = formData
        .getAll("topics")
        .map((topic) => String(topic).trim())
        .filter(Boolean);

      setSubjects((current) =>
        current.map((subject) =>
          subject.id === subjectId
            ? {
                ...subject,
                subject_name: updatedName,
                current_topics: [...new Set(updatedTopics)],
              }
            : subject
        )
      );

      setEditingId(null);
      setEditSuccess(result.success ?? "Subject updated successfully!");
    });
  }

  function handleDelete(subjectId: string) {
    setEditError("");
    setEditSuccess("");

    startTransition(async () => {
      const result = await deleteSubject(subjectId);

      if (result.error) {
        setEditError(result.error);
        return;
      }

      setSubjects((current) =>
        current.filter((subject) => subject.id !== subjectId)
      );

      setEditSuccess("Subject removed successfully!");
    });
  }

  return (
    <div className="mt-8 space-y-10">
      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="subjectName"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Subject name
          </label>
          <input
            id="subjectName"
            name="subjectName"
            type="text"
            placeholder="e.g. Auditing"
            maxLength={100}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Classroom topics
          </label>

          <div className="space-y-3">
            {topics.map((topic, index) => (
              <div key={index} className="flex gap-2">
                <input
                  name="topics"
                  type="text"
                  value={topic}
                  onChange={(event) =>
                    updateTopic(index, event.target.value)
                  }
                  placeholder={`Topic ${index + 1}, e.g. Internal Controls`}
                  maxLength={150}
                  className={inputClassName}
                />

                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopicField(index)}
                    className="rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                    aria-label={`Remove topic ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTopicField}
            disabled={topics.length >= 30}
            className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-50"
          >
            + Add another topic
          </button>
        </div>

        {state.error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm font-medium text-green-700">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Add subject"}
        </button>
      </form>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Your academic subjects
        </h2>

        {subjects.length === 0 ? (
          <p className="mt-3 text-sm text-gray-700">
            You haven&apos;t added any subjects yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                {editingId === subject.id ? (
                  <form
                    onSubmit={(event) => handleUpdate(event, subject.id)}
                    className="space-y-3"
                  >
                    <label className="block text-sm font-semibold text-gray-800">
                      Subject name
                      <input
                        name="subjectName"
                        defaultValue={subject.subject_name}
                        required
                        maxLength={100}
                        className={editInputClassName}
                      />
                    </label>

                    <p className="text-sm font-semibold text-gray-800">
                      Classroom topics
                    </p>

                    {subject.current_topics.map((topic, index) => (
                      <input
                        key={index}
                        name="topics"
                        defaultValue={topic}
                        maxLength={150}
                        className={editInputClassName}
                      />
                    ))}

                    <input
                      name="topics"
                      placeholder="Add another topic"
                      maxLength={150}
                      className={editInputClassName}
                    />

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isWorking}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
                      >
                        {isWorking ? "Saving..." : "Save changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {subject.subject_name}
                      </h3>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingId(subject.id)}
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(subject.id)}
                          disabled={isWorking}
                          className="text-sm font-semibold text-red-700 hover:text-red-800 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
                      Classroom topics
                    </p>

                    {subject.current_topics.length === 0 ? (
                      <p className="mt-2 text-sm text-gray-700">
                        No topics added yet.
                      </p>
                    ) : (
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-800">
                        {subject.current_topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {editError && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-700">
            {editError}
          </p>
        )}

        {editSuccess && (
          <p role="status" className="mt-4 text-sm font-medium text-green-700">
            {editSuccess}
          </p>
        )}
      </div>
    </div>
  );
}
