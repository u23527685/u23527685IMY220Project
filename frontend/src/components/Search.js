import React from "react";
const { useRef, useState } = React;

function Search({onsearch}){
    const searchref=useRef();
    const handleSearch=()=>{
        const search=searchref.current.value;
        if(search && onsearch)
            onsearch(search);
    }
    return(
        <div className="search">
            <input ref={searchref} onChange={handleSearch} type="search" />
        </div>
    )
}

export default Search;