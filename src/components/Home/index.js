import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectList: [],
  }

  componentDidMount() {
    this.getItemDetails()
  }

  onClickResponse = () => {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    const {activeOptionId} = this.state
    console.log(activeOptionId)
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProjectView = () => {
    const {projectList} = this.state
    console.log(projectList)

    return (
      <div className="all-products-container">
        <ul>
          {projectList.map(eachItem => (
            <li key={eachItem.id}>
              <img src={eachItem.imageUrl} alt={eachItem.name} />
              <p>{eachItem.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="button" onClick={this.onClickResponse}>
        Retry
      </button>
    </div>
  )

  onChangeOptionId = event => {
    this.setState({activeOptionId: event.target.value}, this.getItemDetails)
  }

  renderProjectDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    console.log(activeOptionId)
    return (
      <>
        <Header />
        <div>
          <select onChange={this.onChangeOptionId}>
            {categoriesList.map(eachItem => (
              <option value={eachItem.id} key={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectDetails()}
        </div>
      </>
    )
  }
}

export default Home
