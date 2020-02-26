import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Spinner from '../layout/spinner';
import { Link, withRouter } from 'react-router-dom';
import { getProfileById } from '../../actions/profile';
import spinner from '../layout/spinner';

const Profile =({
    
    getProfileById,
    profile:{ profile , loading },
    auth,
    match
    
})=> {
    useEffect(()=> {
        
        getProfileById(match.params.id);
       console.log(match)
    },[getProfileById])
   
    return (
        <Fragment>
           { profile  === null || loading? (

           <Spinner/>
           ):(
           <Fragment>
      <Link to='/profiles' className='btn btn-light'>
          Back to Profiles
      </Link>
      {auth.isAuthenticated && auth.loading === false && auth.user.id ===
      profile.user._id && (<Link to='/edit-profile' className='btn btn-dark'>
          Edit Profile
      </Link>)}
      </Fragment>
            ) }
        </Fragment>
     
    )

      }

Profile.propTypes = {
    getProfileById:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired,

}

const mapStateProps = state=>({
    profile: state.profile,
    auth: state.auth
})
export default connect(mapStateProps,{getProfileById})(withRouter(Profile));