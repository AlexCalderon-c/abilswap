function LessonFooter() {
  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm border-t border-border p-5 flex justify-between'>
        <button className='px-3 py-2 border cursor-pointer rounded'>
            Hint
        </button>
        <div className='flex gap-6 '>
            {/*Button section */}
            <button className='px-3 py-2 border cursor-pointer rounded'>Back</button>
            <button className='px-3 py-2 border cursor-pointer rounded'>Next</button>
        </div>
    </footer>
  )
}

export default LessonFooter