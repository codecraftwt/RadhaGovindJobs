import { createDrawerNavigator } from "@react-navigation/drawer";
import JobsCategoryMnt from "../Screens/Admin/Reports/JobsCategoryMnt";
import SubscriptionMnt from "../Screens/Admin/Reports/SubscriptionMnt";
import JobsReport from "../Screens/Admin/Reports/JobsReport";
import SubscriptionReport from "../Screens/Admin/Reports/SubscriptionReport";
import { h, w } from "walstar-rn-responsive";
import ProfileDetails from "../Screens/Admin/Home/profileDetails";
import JobDetails from "../Screens/Admin/Jobs/jobDetails";
import CandidateDetails from "../Screens/Admin/Candidate/CandidateDetails";
import EmployerDetails from "../Screens/Admin/Employee/EmployerDetails";
import ConsultantDetails from "../Screens/Admin/Consultant/ConsultantDetails";
import NoData from "../Screens/Common/Nodata";
import NotificationScreenAdmin from "../Screens/Admin/Home/NotificationScreenAdmin";
import Skill from "../Screens/Admin/Reports/Skill";
import Jobtype from "../Screens/Admin/Reports/Jobtype";
import AddCandidates from "../Screens/Admin/Candidate/AddCandidates";
import DynamicBottomNav from "./DynamicBottomNav";
import Applications from "../Screens/Admin/Jobs/Applications";
import AddJob from "../Screens/Admin/Jobs/AddJob";
import DynamicCustomDrawer from "./DynamicCustomDrawer";
import Education from "../Screens/Admin/Reports/Education";
import CandidatesMnt from "../Screens/Admin/Candidate/CandiatesMnt";
import JobsMnt from "../Screens/Admin/Jobs/JobsMnt";
import UserProfile from "../Screens/Admin/Home/UserProfile";
import usePermissionCheck from "../Utils/HasPermission";
import Saved from "../Screens/Admin/Home/Saved";
import Grampanchayat from "../Screens/Admin/Grampanchayat/Grampanchayat";
import GrampanchayatDeatils from "../Screens/Admin/Grampanchayat/GrampanchayatDetails";
import AppliedJobs from "../Screens/Admin/Jobs/AppliedJobs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResumeViewer from "../Components/ResumeViewer";

export default function DynamicDrawerNavigation() {
  const Drawer = createDrawerNavigator();
  const hasPermission = usePermissionCheck()
  const insets = useSafeAreaInsets(); // get safe area insets
  
  return (
    <Drawer.Navigator 
    screenOptions={{headerShown:false,
    drawerStyle: {
      marginTop:h(4),
      width:w(80),
      borderTopRightRadius: w(4),
      borderBottomRightRadius: w(4),
      paddingBottom:Math.max(insets.bottom, h(2)),
    }
  }}
     drawerContent={props => <DynamicCustomDrawer {...props} />}>
      <Drawer.Screen name="bottomnavigation" component={DynamicBottomNav} />
      <Drawer.Screen name="JobsCategoryMnt" component={JobsCategoryMnt} />
      <Drawer.Screen name="SubscriptionMnt" component={SubscriptionMnt} />
      <Drawer.Screen name="JobsReport" component={JobsReport} />
      <Drawer.Screen name="SubscriptionReport" component={SubscriptionReport} />
      <Drawer.Screen name="JobDetails" component={JobDetails} />
      <Drawer.Screen name="UserDetails" component={hasPermission('Candidate Profile Page') ? UserProfile : ProfileDetails} />
      <Drawer.Screen name="CandidateDetails" component={CandidateDetails} />
      <Drawer.Screen name="EmployerDetails" component={EmployerDetails} />
      <Drawer.Screen name="ConsultantDetails" component={ConsultantDetails} />
      <Drawer.Screen name="Nodata" component={NoData} />
      <Drawer.Screen name="Skill" component={Skill} />
      <Drawer.Screen name="Jobtype" component={Jobtype} />
      <Drawer.Screen name="Education" component={Education} />
      <Drawer.Screen name="JobListMnt" component={JobsMnt} />
      <Drawer.Screen name="Applications" component={Applications} />
      <Drawer.Screen name="AddJob" component={AddJob} />
      <Drawer.Screen name="NotificationScreenAdmin" component={NotificationScreenAdmin} />
      <Drawer.Screen name="AddCandidates" component={AddCandidates} />
      <Drawer.Screen name="CandidateMnt" component={CandidatesMnt} />
      <Drawer.Screen name="SavedJobs" component={Saved} />
      <Drawer.Screen name="Grampanchayat" component={Grampanchayat} />
      <Drawer.Screen name="GrampanchayatDeatils" component={GrampanchayatDeatils} />
      <Drawer.Screen name="AppliedJobs" component={AppliedJobs} />
      <Drawer.Screen name="ResumeViewer" component={ResumeViewer} />

    </Drawer.Navigator>
  );
}