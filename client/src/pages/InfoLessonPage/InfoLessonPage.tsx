import React from 'react'
import { useLoaderData } from 'react-router-dom'
import ArticleLesson from '../../components/lessonInfo/articleLesson/ArticleLesson'
import QuizLesson from '../../components/lessonInfo/quizLesson/QuizLesson'
import TextLesson from '../../components/lessonInfo/textLesson/TextLesson'
import VideoLesson from '../../components/lessonInfo/videoLesson/VideoLesson'

function InfoLessonPage() {
    
  const loadedData = useLoaderData()
  return (
    <>
        {
            loadedData.content_type === "text" ? <TextLesson/> : 
            loadedData.content_type === "video" ? <VideoLesson/> : 
            loadedData.content_type === "quiz" ? <QuizLesson/> :
            loadedData.content_type === "pdf" ? <ArticleLesson/> :
            <></>
        }
    </>
    
  )
}

export default InfoLessonPage