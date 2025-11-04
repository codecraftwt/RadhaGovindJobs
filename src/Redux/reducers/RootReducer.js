import { combineReducers } from '@reduxjs/toolkit';
import jobReducer from '../Slices/Jobslice'
import EmployeeReducer from '../Slices/Employerslice'
import CandidateReducer from '../Slices/Candidateslice'
import consultantsReducer from '../Slices/Consultantslice'
import skillReducer from '../Slices/Skillslice'
import authReducer from '../Slices/authslice'
import jobcategoryReducer from '../Slices/JobCategoryslice'
import JobTypeReducer from '../Slices/JobTypeslice';
import EducationReducer from '../Slices/Educationslice';
import PermissionReducer from '../Slices/Permissionslice';
import locationReducer from '../Slices/Locationslice';
import GrampanchayatReducer from '../Slices/Grampanchayatslice';
import ApplicationsReducer from '../Slices/Applicationslice'
import jobReportReducer from '../Slices/jobReportSlice'
import subscriptionReportReducer from '../Slices/subscriptionReportSlice'
import ProfileSlice from '../Slices/ProfileSlice';
import DeleteProfile from '../Slices/deleteSlice';



const rootReducer = combineReducers({
  jobs: jobReducer,
  employers: EmployeeReducer,
  candidates:CandidateReducer,
  consultants:consultantsReducer,
  auth:authReducer,
  jobCategory:jobcategoryReducer,
  skills:skillReducer,
  JobType:JobTypeReducer,
  Permissions:PermissionReducer,
  Education:EducationReducer,
  location:locationReducer,
  Grampanchayat:GrampanchayatReducer,
  Applications:ApplicationsReducer,
  jobReport:jobReportReducer,
  subscriptionReport:subscriptionReportReducer,
  Profile:ProfileSlice,
  delete:DeleteProfile
});

export default rootReducer;