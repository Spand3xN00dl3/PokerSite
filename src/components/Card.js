import React, { useState } from "react";

export function Card({ rank="none", suit="none" }) {
    if(rank === "none" || suit === "none") {
        return (
            <div>
                <img className="" src="/images/cardback1.png"></img>
           </div>
        )
    }
    const path = "/images/" + rank + suit + ".png";
    return (
        <div className="">
            <img className="" src={path} alt={rank + " of " + suit}></img>
        </div>
    );
    // return (<img src={""})
    // <img src={"../images/"
}