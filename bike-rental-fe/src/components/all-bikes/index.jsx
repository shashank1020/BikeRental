import {useEffect, useState} from "react";
// component
import {Grid, Pagination, Typography} from "@mui/material";
import BikeCard from "../atoms/bike-card";
import {Container, FilterWrapper} from "./styles";
import Filter from "../filter";
import {filterQuery, filterRunner} from "../../lib/common";

const initFilter = {
    model: [], color: [], avgRating: []
}

const AllBikes = ({bikeList, handelBooking, setForm, setRefreshPage, setUpdateBikeData}) => {
    const [allBikes, setAllBikes] = useState([])
    const [pages, setPages] = useState({});
    const [selectedFilter, setSelectedFilter] = useState(initFilter)

    const handleCheckboxChange = (title, key) => {
        const index = selectedFilter[key]?.indexOf(title)
        let newAr
        if (index > -1) {
            newAr = selectedFilter[key]
            newAr.splice(index, 1)
        } else newAr = [...selectedFilter[key], title]
        setSelectedFilter({...selectedFilter, [key]: newAr})
    }
    const clearFilter = () => {
        setSelectedFilter(initFilter)
        setAllBikes(bikeList?.bikes)
    }

    useEffect(() => {
        let filteredBikes = []
        if (JSON.stringify(selectedFilter) === JSON.stringify(initFilter))
            setAllBikes(bikeList?.bikes)
        else {
            filteredBikes = bikeList.bikes.filter((bike)=>filterRunner(bike, selectedFilter))
            setAllBikes(filteredBikes)
        }
    }, [selectedFilter])

    useEffect(() => {
        setAllBikes(bikeList.bikes)
        setSelectedFilter(initFilter)
        setPages({currPage: bikeList?.page, totalPages: bikeList?.pageCount})
    }, [bikeList])

    useEffect(() => {
        setForm(prev => ({...prev, page: pages.currPage}))
    }, [pages.currPage])

    return (
        <Container spacing={2}>
            <FilterWrapper container flexDirection='column' justifyContent='flex-start' md={3}>
                <Filter handleCheckboxChange={handleCheckboxChange} filterObj={selectedFilter} clear={clearFilter}/>
            </FilterWrapper>
            <Grid container md={9} justifyContent="center">
                <Grid container justifyContent="center" spacing={5} className='all-bike-wrapper'>
                    {Array.isArray(allBikes) && allBikes.length > 0 && allBikes.map(bike => (
                        <BikeCard key={bike.id} bikeObj={bike} handelBooking={handelBooking}
                                  setRefreshPage={setRefreshPage} setUpdateBikeData={setUpdateBikeData}/>))}
                    {Array.isArray(allBikes) && allBikes.length <= 0 && (
                        <Typography variant="h4">No Bikes Found</Typography>)}
                </Grid>
                <Grid item className="pagination center">
                    {bikeList?.bikes?.length !== 0 && <Pagination
                        count={pages.totalPages}
                        page={pages.currPage}
                        onChange={(_, pageNumber) => setPages({...pages, currPage: pageNumber})}
                        color="primary"
                    />}
                </Grid>
            </Grid>
        </Container>
    )
}

export default AllBikes;