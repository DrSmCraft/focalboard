// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react'

import './tree.scss'

export default function TreeIcon(): JSX.Element {
    return (<svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 640 512'
        fill='currentColor'
        className='TreeIcon Icon'
            >

        <path
            d='M384 320H256c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32zM192 32c0-17.7-14.3-32-32-32H32C14.3 0 0 14.3 0 32v128c0 17.7 14.3 32 32 32h95.7l73.2 128C212 301 232.4 288 256 288h.3L192 175.5V128h224V64H192V32zM608 0H480c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32z'
        />
    </svg>)
}
