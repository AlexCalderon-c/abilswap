import {useState, useCallback} from 'react'
import { apiClient } from '../../../api/axios'
import type { Rating } from '../../../types'


interface RatingProps{
    courseid: number,
    rating: Rating
}

function RatingItem({courseid, rating}: RatingProps) {
    const [ratingState, setRatingState] = useState(rating.rating_score ? rating.rating_score : 0)
    const [hoverState, setHoverState] = useState(0)

    const handleRating = useCallback(async (ratingScore: number) => {
        const ratingBody = {
            rating_score: ratingScore
        }
        console.log("SOY PUTO: ", rating)

        if(rating){
            await apiClient.put(`/api/rating/${courseid}`, ratingBody)
        }else{
            await apiClient.post(`/api/rating/${courseid}`, ratingBody)
        }
        setRatingState(ratingScore)
    }, [courseid])

  return (
    <div className='mt-5'>
        <p>Rate this course: </p>
        <p>Rating: {ratingState}</p>
        <div className='flex gap-2'>
            {
            [...Array(5)].map((_, index) => {

                const ratingValue = index + 1
                return (
                    <label htmlFor="" id={`${index}`} className='cursor-pointer' onClick={() => handleRating(ratingValue)}>
                        <input type="radio" className='hidden' value={ratingValue} />
                        <svg
                            viewBox="0 0 24 24"
                            width="15"
                            height="15"
                            fill='currentColor'
                            stroke='currentColor'
                            xmlns="http://w3.org"
                            className='text-yellow-400'
                        >
                            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                        </svg>
                    </label>
                    )
                    } 
                )
            }
        </div>

       
    </div>
  )
}

export default RatingItem