"use client";

import React, { useState } from 'react';

export default function Checkbox() {
    const [selectedCheckbox, setCheckbox] = useState(false);
    
    return (  
        <input 
            type="checkbox" 
            checked={selectedCheckbox} 
            onChange={(e) => setCheckbox(e.target.checked)} 
            className='w-4 h-4 rounded-lg' 
        />
    );
}
