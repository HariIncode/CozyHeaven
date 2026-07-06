import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import HotelDataService from '../../services/hotelService';

function HotelList() {

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState([]);
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = () => {
    HotelDataService.getAllHotels().then((response) => {
      setHotels(response.data);
      setLoa
    })
  }

  return (
    <div>HotelList</div>
  )
}

export default HotelList;