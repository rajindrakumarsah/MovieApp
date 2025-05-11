import React from 'react'

//destructuring movie elements from movie for easy purpose which make directly call by shortcuts 
const MovieCard = ({ movie:
  { title, vote_average, poster_path, release_date, original_language }
}) => {
  return (
    <div className="movie-card">
      {/* this is the poster image , where we have to give path of image from tmdb/${poster_path} <- This is the id of the particular movie */}
      <img
        src={poster_path ?
          `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
      />

      {/* card components */}
      <div className="mt-4">
        {/* title of movie */}
        <h3>{title}</h3>
        
        <div className="content">

          {/* Rating : here is conditon ,  if rating exist then show with fixed and also round the decimal else N/A */}
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          {/* .  is seperation of elements */}
          <span>•</span>
          {/* langauge of movie */}
          <p className="lang">{original_language}</p>

          <span>•</span>
          {/* release date of movie: here is conditon split('-')[0] which will show year part only */}
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
export default MovieCard
