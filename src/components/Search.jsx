import React from 'react'

// Destructuring SearchTerm,setSearchTerm
const Search = ({SearchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
    <div >
        <img src="search.svg" alt="search" />
         {/* firstly it will take value ✅ The input’s value is controlled by React state
        ✅ Every time you type, it updates the state
        ✅ The displayed value is always equal to SearchTerm (the state) */}
        <input type="text" placeholder="Search Through Thousands of movies" value={SearchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
    </div>
  )
}

export default Search