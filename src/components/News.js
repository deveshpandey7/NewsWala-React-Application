import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

     capitalizeFirstLetter = (string)=> {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


     constructor(props){ // constructor runs 1st
        super(props);
        console.log("Im a news constructor");
        this.state = {
            articles: [],
            loading: false, 
            page: 1,
            totalResults: 0
        }
        document.title = `NewsWala - ${this.capitalizeFirstLetter(this.props.category)} `
     }

     async updateNews(){
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=681c63cafd93437f8037ebb3ac186297&page=${this.state.page}&pageSize=${this.props.pageSize}`;
         this.setState({loading: true});
         let data = await fetch(url);
         let parsedData = await data.json()
         console.log(parsedData);
         this.setState({articles: parsedData.articles,
                         totalResults: parsedData.totalResults,
                         loading: false 
                        })
       this.props.setProgress(100);               
     }

     async componentDidMount(){ // this runs 3rd after constructor & render method
                                // code is commented coz same is written and used in updatenews function(resuability shown)

        //  let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=681c63cafd93437f8037ebb3ac186297&page=1&pageSize=${this.props.pageSize}`;
        //  this.setState({loading: true});
        //  let data = await fetch(url);
        //  let parsedData = await data.json()
        //  console.log(parsedData);
        //  this.setState({articles: parsedData.articles,
        //                  totalResults: parsedData.totalResults,
        //                  loading: false 
        //                 })
        this.updateNews();
     }


     handlePreviousClick = async ()=>{ // code is commented coz same is written and used in updatenews function(resuability shown)

        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=681c63cafd93437f8037ebb3ac186297&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        // this.setState({loading: true});
        // let data = await fetch(url);
        // let parsedData = await data.json()
        // console.log(parsedData);
        // this.setState({
        //     page: this.state.page - 1,
        //     articles: parsedData.articles,
        //     loading: false
        // })
        this.setState({page: this.state.page - 1});
        this.updateNews();
     }

     handleNextClick = async ()=>{ // code is commented coz same is written and used in updatenews function(resuability shown)

    //     if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){

    //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=681c63cafd93437f8037ebb3ac186297&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //     this.setState({loading: true});
    //     let data = await fetch(url);
    //     let parsedData = await data.json()
    //     this.setState({
    //         page: this.state.page + 1,
    //         articles: parsedData.articles,
    //         loading: false
    //     })
    // }
      this.setState({page: this.state.page + 1});
      this.updateNews();
     }

     fetchMoreData = async () => {
        
        this.setState({page: this.state.page + 1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=681c63cafd93437f8037ebb3ac186297&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;   
         let data = await fetch(url);
         let parsedData = await data.json()
         console.log(parsedData);
         this.setState({articles: this.state.articles.concat(parsedData.articles),
                         totalResults: parsedData.totalResults
                         
                        })
      }

  render() { // this runs 2nd after constructor
    return (
             <>
                <h1 className="text-center" style={{margin: '35px 0px'}}>NewsWala - Top Headlines coming from {this.capitalizeFirstLetter(this.props.category)}</h1>
             
               {this.state.loading && <Spinner/>} 

                        <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={ <Spinner/>}
                    >
                   <div className="container">
                    <div className="row">
                        { this.state.articles.map((element) =>{
                            return  <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title} description={element.description} imageurl={element.urlToImage} newsurl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                        })}         
             </div>
             </div>
             </InfiniteScroll>

             {/* <div className="container d-flex justify-content-between">
             <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
             <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
             </div> */}
        </>
    )
  }
}

export default News
