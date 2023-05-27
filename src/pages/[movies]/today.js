import React, {useEffect, useContext, useState} from 'react'
import Head from 'next/head'
import Navbar from '../../components/Navbars/Navbars'
import Intro from '../../components/Intro/Intro'
import MovieList from '../../components/MovieLists/MovieList'
import Footer from '../../components/Footer/Footer'
import Pagination from '../../components/Pagination/Pagination'
import {AppsData} from '../../utils/context/appDataContext'
import {scrollTop, spd, initData} from '../../utils/common/common'
import {getDataPage} from '../../utils/apis/api'

export default function Popular() {
  const {setActiveRoute} = useContext(AppsData)
  const [data, setData] = useState(initData)
  const [session, setSession] = useState({
    isSet: false,
    isTrue: false
  })

  useEffect(()=>{
    setActiveRoute('Today')
    if(!data.isSet) {
      async function gData (){
        let a = await getDataPage('/trending/all/day', 1)
        setData( spd(a.data, data))
      }
      gData()
    } 

    // check if the session is empty or not
    let hsession = sessionStorage.getItem('movie-box')
    if(!session.isSet) {
      if(hsession){
        setSession({isSet: true})
      } else {
        setSession({isSet: true, isTrue: true})
      }
    }
  },[])

  async function getNewData(val){
    let a = await getDataPage('/trending/all/day', val)
    setData( spd(a.data, data))
    scrollTop()
  } 

  return (
    <div className='main-container content-center'>
      <Head>
        <title>Movie Box | Trending - Today</title>
        <link rel="icon" href="/image/favicon.ico" />

        <link rel="apple-touch-icon" href="/image/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Aiman Adlawan"/>
        <meta name="description" content="This Movie Box website is developed by Aiman Adlawan that allows the visitor to search movies produced from all over the world." />

        <meta property="og:title" content="Movie Box - Trending - Today" />
        <meta property="og:description" content="This Movie Box website is developed by Aiman Adlawan that allows the visitor to search movies produced from all over the world." />
        <meta property="og:image" content="/image/movie-box-logo.ico" />
        <meta property="og:url" content="https://movie-box-flame.vercel.app/" />

        <meta name="twitter:title" content="Movie Box - Trending - Today" />
        <meta name="twitter:description" content="This Movie Box website is developed by Aiman Adlawan that allows the visitor to search movies produced from all over the world." />
        <meta name="twitter:image" content="/image/movie-box-logo.ico" />
        <meta name="twitter:card" content="summary" />
      </Head>

      <div className="main page-padding">
        { session.isSet ? 
          <> { session.isTrue ? <Intro /> : null }
          <Navbar 
            onSearchPage={false}/>  
          { Object.keys(data.data).length !== 0 ? 
              <MovieList 
                viewBtn={false}
                hlink='/[movies]/today'
                aslink='/trending/today'
                link='/trending/today'
                type='movie'
                title={'Trending Today'}
                total={data.data.total_results}
                data={data.data.results}/> : null
          }
          <Pagination 
            click={(val=>getNewData(val))}
            totalpages={data.totalpages} />
          <Footer quote={5}/>
        </> : null }
      </div>
    </div>
  )
}

