import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApiCall } from '../context/apiCall';
import Breadcrumb from '../components/BreadCrumb';
import { PAGES } from '../utils/constants';
import ProfileJobSeeker from '../components/ProfileJobSeeker';
import ProfileEmployer from '../components/ProfileEmployer';
import EmptyData from '../components/EmptyData';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyMessage from '../components/EmptyMessage';

const main = () => {
  const router = useRouter();
  const { apiData, getResumeDetailsApi, getSingleCompanyProfileApi } =
    useApiCall();
  const [mainData, setMainData] = useState({
    profileDetails: { data: null, isLoading: true },
  });
  const [profileType, setProfileType] = useState('');

  const getResumeDetails = async (resumeUid) => {
    try {
      const data = await getResumeDetailsApi({
        uid: resumeUid,
      });

      setProfileType('resume');
      setMainData((prevData) => ({
        ...prevData,
        profileDetails: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      setMainData((prevData) => ({
        ...prevData,
        profileDetails: {
          data: null,
          isLoading: false,
        },
      }));
      console.error(error);
    }
  };

  const getCompanyDetails = async (companyProfileUid) => {
    try {
      const data = await getSingleCompanyProfileApi({
        uid: companyProfileUid,
      });

      setProfileType('company');
      setMainData((prevData) => ({
        ...prevData,
        profileDetails: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      setMainData((prevData) => ({
        ...prevData,
        profileDetails: {
          data: null,
          isLoading: false,
        },
      }));
      console.error(error);
    }
  };

  const profileCondition = () => {
    const { profile, companyProfile, resume } = apiData;
    const { uid, type } = router.query;

    if (!profile.isLoading && !companyProfile.isLoading && !resume.isLoading) {
      if (uid && type) {
        if (type === 'resume') {
          getResumeDetails(uid);
        } else if (type === 'company') {
          getCompanyDetails(uid);
        } else {
          setMainData((prevData) => ({
            ...prevData,
            profileDetails: {
              data: null,
              isLoading: false,
            },
          }));
        }
      } else if (
        profile.data?.account_type &&
        apiData.profile.data?.onboarding == true
      ) {
        const accountType = profile.data.account_type;
        if (accountType === 'job_seeker') {
          getResumeDetails(resume.data?.uid);
        } else if (accountType === 'employer') {
          getCompanyDetails(companyProfile.data?.uid);
        }
      } else {
        router.push(PAGES.onboard.directory);
      }
    }
  };

  useEffect(() => {
    profileCondition();
  }, [
    apiData.profile.isLoading,
    apiData.companyProfile.isLoading,
    apiData.resume.isLoading,
    router.query,
  ]);

  const viewConfig = {
    company: {
      view: (
        <ProfileEmployer
          item={mainData.profileDetails.data}
          showBtnExternalPage={false}
          onSuccessFunction={profileCondition}
        />
      ),
    },
    resume: {
      view: (
        <ProfileJobSeeker
          item={mainData.profileDetails.data}
          showBtnExternalPage={false}
          onSuccessFunction={profileCondition}
        />
      ),
    },
  };

  return (
    <div className="body">
      <section class="container">
        <Breadcrumb page={PAGES.profile} />
        {mainData.profileDetails.isLoading == false &&
        mainData?.profileDetails?.data ? (
          viewConfig[profileType]?.view
        ) : (
          <>
            {mainData.profileDetails.isLoading == true ? (
              <LoadingSpinner isLoading />
            ) : (
              <EmptyMessage />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default main;
