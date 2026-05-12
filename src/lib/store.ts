"use client";

import { useState, useEffect } from "react";
import { BQ_DATA as initialData } from "./data";

export function useBQData() {
  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bq_data_v2");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        localStorage.setItem("bq_data_v2", JSON.stringify(initialData));
      }
    } catch (e) {
      console.error("Failed to load bq_data from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const saveLesson = (subjectId: string, newLesson: any) => {
    setData((prev) => {
      const newData = { ...prev };
      const subjectIndex = newData.subjects.findIndex(s => s.id === subjectId);
      if (subjectIndex !== -1) {
        const lessonIndex = newData.subjects[subjectIndex].lessons.findIndex(l => l.id === newLesson.id);
        if (lessonIndex !== -1) {
          newData.subjects[subjectIndex].lessons[lessonIndex] = newLesson;
        } else {
          newData.subjects[subjectIndex].lessons.push(newLesson);
        }
        localStorage.setItem("bq_data", JSON.stringify(newData));
      }
      return newData;
    });
  };

  const deleteLesson = (subjectId: string, lessonId: string) => {
    setData((prev) => {
      const newData = { ...prev };
      const subjectIndex = newData.subjects.findIndex(s => s.id === subjectId);
      if (subjectIndex !== -1) {
        newData.subjects[subjectIndex].lessons = newData.subjects[subjectIndex].lessons.filter(l => l.id !== lessonId);
        localStorage.setItem("bq_data", JSON.stringify(newData));
      }
      return newData;
    });
  };

  return { data, isLoaded, saveLesson, deleteLesson };
}
