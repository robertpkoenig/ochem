// Landing page for Ochem.io

import React, { useState } from 'react'
import VideoPopup from '../components/VideoPopup'
import { NextPage } from 'next'
import TopPanel from '../components/landing-page/top-panel.tsx/TopPanel'
import HowItWorks from '../components/landing-page/HowItWorks'
import Features from '../components/landing-page/Features'
import BottomPanel from '../components/landing-page/BottomPanel'

const LandingPage: NextPage = () => {

    const [videoPopupVis, setVideoPopupVis] = useState<boolean>(false)

    function toggleVideoPopup() {
        setVideoPopupVis(!videoPopupVis)
    }

    return (
        <>

        <TopPanel toggleVideoPopup={toggleVideoPopup} />    
        <HowItWorks />
        <Features />
        <BottomPanel toggleVideoPopup={toggleVideoPopup} />

        { videoPopupVis && <VideoPopup popupCloseFunction={toggleVideoPopup} />}

        </>
  )
}

export default LandingPage
