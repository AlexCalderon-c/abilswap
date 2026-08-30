import { useLoaderData } from 'react-router-dom'
import type { Lesson } from '../../types'
import ArticleLesson from '../../components/lessonInfo/articleLesson/ArticleLesson'
import QuizLesson from '../../components/lessonInfo/quizLesson/QuizLesson'
import TextLesson from '../../components/lessonInfo/textLesson/TextLesson'
import VideoLesson from '../../components/lessonInfo/videoLesson/VideoLesson'

function InfoLessonPage() {
  const loadedData = useLoaderData() as Lesson

  return (
    <>
      {loadedData.content_type === 'text' ? (
        <TextLesson lesson={loadedData} />
      ) : loadedData.content_type === 'video' ? (
        <VideoLesson lesson={loadedData} />
      ) : loadedData.content_type === 'quiz' ? (
        <QuizLesson />
      ) : loadedData.content_type === 'pdf' ? (
        <ArticleLesson lesson={loadedData} />
      ) : (
        <></>
      )}
    </>
  )
}

export default InfoLessonPage
