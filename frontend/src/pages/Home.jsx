import React from 'react'
import Hero from '../Components/Hero'
import FeaturedDestination from '../Components/FeaturedDestination'
import ExclusiveOffers from '../Components/ExclusiveOffers'
import Testimonial from '../Components/Testimonial'
import NewsLetter from '../Components/NewsLetter'

const Home = () => {
  return (
    <>
        <Hero />
        <FeaturedDestination />
        <ExclusiveOffers />
        <Testimonial />
        <NewsLetter />
    </>
  )
}

export default Home