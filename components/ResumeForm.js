import { useEffect, useState } from 'react';
import {
  COUNTRIES,
  CURRENT_JOB_STATUS,
  GENDERS,
  SALARY_TYPES,
} from '../utils/constants';
import DynamicWorkExperienceForm from './DynamicWorkExperienceForm';
import DynamicEducationBackgroundForm from './DynamicEducationBackgroundForm';
import GlobalButton from './GlobalButton';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import DynamicSkillsForm from './DynamicSkillsForm';
import DynamicLanguagesForm from './DynamicLanguagesForm';
import { useModal } from '../context/modal';

const ResumeForm = ({ section = null, onSuccessFunction = null }) => {
  const { apiData, addResumeApi } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();

  const [formValue, setFormValue] = useState({
    full_name: '',
    email: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    state: '',
    country: '',
    current_job_status: '',
    preferred_job: '',
    expected_min_salary: '',
    expected_max_salary: '',
    expected_salary_type: '',
  });

  const [arrayElements, setArrayElements] = useState({
    workExperience: [],
    educationBackground: [],
    skills: [],
    languages: [],
  });

  const [buttonConfig, setButtonConfig] = useState({
    profile: {
      keyName: 'profile',
      submit: {
        isLoading: false,
      },
    },
    job: {
      keyName: 'job',
      submit: {
        isLoading: false,
      },
    },
    workExperience: {
      keyName: 'workExperience',
      submit: {
        isLoading: false,
      },
    },
    educationHistory: {
      keyName: 'educationHistory',
      submit: {
        isLoading: false,
      },
    },
    skills: {
      keyName: 'skills',
      submit: {
        isLoading: false,
      },
    },
    languages: {
      keyName: 'languages',
      submit: {
        isLoading: false,
      },
    },
  });

  useEffect(() => {
    if (apiData.resume.data?.length !== 0) {
      const resumeData = apiData.resume.data;
      const updatedFormValue = { ...formValue };
      Object.keys(formValue).forEach((key) => {
        if (resumeData.hasOwnProperty(key)) {
          updatedFormValue[key] = resumeData[key] || '';
        }
      });

      setFormValue(updatedFormValue);
      setArrayElements((prevState) => ({
        ...prevState,
        workExperience: resumeData?.work_experience || [],
        educationBackground: resumeData?.education_background || [],
        skills: resumeData?.skills || [],
        languages: resumeData?.languages || [],
      }));
    }
  }, [apiData.resume?.data]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: value,
    }));
  };

  const configForm = {
    personalDetails: {
      title: 'Personal Info',
      inputValue: {
        full_name: formValue.full_name,
        email: formValue.email,
        gender: formValue.gender,
        date_of_birth: formValue.date_of_birth,
        phone_number: formValue.phone_number,
        address_1: formValue.address_1,
        address_2: formValue.address_2,
        city: formValue.city,
        postcode: formValue.postcode,
        state: formValue.state,
        country: formValue.country,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.profile.keyName)
            }
          >
            <div class="col mb-3">
              <label htmlFor="input-full-name" class="form-label">
                Full Name
              </label>
              <input
                type="text"
                class="form-control"
                id="input-full-name"
                value={formValue.full_name}
                onChange={handleChange('full_name')}
                required
              />
            </div>
            <div class="row mb-3 g-2">
              <div class="col-md">
                <label htmlFor="input-email" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="input-email"
                  value={formValue.email}
                  onChange={handleChange('email')}
                  required
                />
              </div>
              <div class="col-md-4">
                <label htmlFor="select-gender" class="form-label">
                  Gender
                </label>
                <select
                  class="form-select"
                  id="select-gender"
                  required
                  value={formValue.gender}
                  onChange={handleChange('gender')}
                >
                  <option value="" disabled>
                    Please select
                  </option>
                  {GENDERS.map((item, index) => {
                    return (
                      <option value={item.value} key={index}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div class="row mb-3 g-2">
              <div class="col-md-4">
                <label htmlFor="input-date-of-birth" class="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="input-date-of-birth"
                  value={formValue.date_of_birth}
                  onChange={handleChange('date_of_birth')}
                  required
                />
              </div>
              <div class="col-md">
                <label htmlFor="input-phone-number" class="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="input-phone-number"
                  value={formValue.phone_number}
                  onChange={handleChange('phone_number')}
                  required
                />
              </div>
            </div>
            <div class="mb-3 row g-2">
              <label htmlFor="input-address-1" class="form-label">
                Address
              </label>
              <input
                type="text"
                class="form-control"
                id="input-address-1"
                value={formValue.address_1}
                onChange={handleChange('address_1')}
                required
                placeholder="Address 1"
              />
              <input
                type="text"
                class="form-control"
                id="input-address-2"
                value={formValue.address_2}
                onChange={handleChange('address_2')}
                placeholder="Address 2"
              />
              <div class="col-md-4">
                <input
                  type="text"
                  class="form-control"
                  id="input-city"
                  value={formValue.city}
                  onChange={handleChange('city')}
                  placeholder="City"
                  required
                />
              </div>
              <div class="col-md-4">
                <input
                  type="text"
                  class="form-control col-md-4"
                  id="input-postcode"
                  value={formValue.postcode}
                  onChange={handleChange('postcode')}
                  placeholder="Postcode"
                  required
                />
              </div>
              <div class="col-md">
                <input
                  type="text"
                  class="form-control"
                  id="input-state"
                  value={formValue.state}
                  onChange={handleChange('state')}
                  placeholder="State"
                  required
                />
              </div>
              <select
                class="form-select"
                id="select-country"
                value={formValue.country}
                onChange={handleChange('country')}
                required
              >
                <option value="" disabled>
                  Please select
                </option>
                {COUNTRIES.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Personal Info"
                btnLoading={buttonConfig.profile.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    jobDetails: {
      title: 'Job Details',
      inputValue: {
        current_job_status: formValue.current_job_status,
        preferred_job: formValue.preferred_job,
        expected_min_salary: formValue.expected_min_salary,
        expected_max_salary: formValue.expected_max_salary,
        expected_salary_type: formValue.expected_salary_type,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.job.keyName)
            }
          >
            <div class="col mb-3">
              <label htmlFor="select-current-job-status" class="form-label">
                Current Job Status
              </label>
              <select
                class="form-select"
                id="select-current-job-status"
                value={formValue.current_job_status}
                onChange={handleChange('current_job_status')}
                required
              >
                <option value="" disabled>
                  Please select
                </option>
                {CURRENT_JOB_STATUS.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class="col mb-3">
              <label htmlFor="input-preferred-job" class="form-label">
                Preferred Job
              </label>
              <input
                type="text"
                class="form-control"
                id="input-preferred-job"
                value={formValue.preferred_job}
                onChange={handleChange('preferred_job')}
                required
              />
            </div>
            <div class="mb-3">
              <label htmlFor="input-expected-min-salary" class="form-label">
                Expected Salary
              </label>
              <div class="row g-2">
                <div class="col-md">
                  <div class="input-group">
                    <span class="input-group-text">RM</span>
                    <input
                      type="number"
                      class="form-control"
                      id="input-expected-min-salary"
                      value={formValue.expected_min_salary}
                      onChange={handleChange('expected_min_salary')}
                      placeholder="min"
                      required
                    />
                  </div>
                </div>
                <div class="col-md">
                  <div class="input-group">
                    <span class="input-group-text">RM</span>
                    <input
                      type="number"
                      class="form-control"
                      id="input-expected-max-salary"
                      value={formValue.expected_max_salary}
                      onChange={handleChange('expected_max_salary')}
                      placeholder="max"
                      required
                    />
                  </div>
                </div>
                <div class="col-md">
                  <select
                    class="form-select"
                    id="select-expected-salary-type"
                    value={formValue.expected_salary_type}
                    onChange={handleChange('expected_salary_type')}
                    required
                  >
                    <option value="" disabled>
                      Please select
                    </option>
                    {SALARY_TYPES.map((item, index) => {
                      return (
                        <option value={item.value} key={index}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Job Details"
                btnLoading={buttonConfig.job.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    workExperience: {
      title: 'Work Experience',
      inputValue: {
        work_experience: arrayElements.workExperience,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.workExperience.keyName)
            }
          >
            <DynamicWorkExperienceForm
              arrayElements={arrayElements}
              setArrayElements={setArrayElements}
            />
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Work Experience"
                btnLoading={buttonConfig.workExperience.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    educationHistory: {
      title: 'Education History',
      inputValue: {
        education_background: arrayElements.educationBackground,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.educationHistory.keyName)
            }
          >
            <DynamicEducationBackgroundForm
              arrayElements={arrayElements}
              setArrayElements={setArrayElements}
            />
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Education History"
                btnLoading={buttonConfig.educationHistory.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    skills: {
      title: 'Skills',
      inputValue: {
        skills: arrayElements.skills,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.skills.keyName)
            }
          >
            <DynamicSkillsForm
              arrayElements={arrayElements}
              setArrayElements={setArrayElements}
            />
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Skills"
                btnLoading={buttonConfig.skills.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    languages: {
      title: 'Languages',
      inputValue: {
        languages: arrayElements.languages,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitResume(event, buttonConfig.languages.keyName)
            }
          >
            <DynamicLanguagesForm
              arrayElements={arrayElements}
              setArrayElements={setArrayElements}
            />
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Languages"
                btnLoading={buttonConfig.languages.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
  };

  const onSubmitResume = async (event, keyName) => {
    event.preventDefault();

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: true,
        },
      },
    }));

    let addData = null;
    if (section) {
      addData = configForm[section].inputValue;
    } else {
      Object.keys(configForm).forEach((key) => {
        if (configForm[key].inputValue) {
          addData = { ...addData, ...configForm[key].inputValue };
        }
      });
    }

    addData.uid = apiData.resume.data?.uid ?? null;

    var success = false;

    const result = await addResumeApi({
      postData: addData,
    });

    if (result) {
      success = true;
    }

    setButtonConfig((prevState) => ({
      ...prevState,
      [keyName]: {
        ...prevState[keyName],
        submit: {
          ...prevState[keyName].submit,
          isLoading: false,
        },
      },
    }));

    if (success) {
      toast.success('Saved!');
      if (section && onSuccessFunction) {
        onSuccessFunction();
      } else {
        toggleModal('editResume');
      }
    }
  };

  if (section) {
    return <div>{configForm[section]?.formView}</div>;
  }

  return (
    <div className="accordion" id="accordionPanelsStayOpenExample">
      {Object.values(configForm).map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2
            className="accordion-header"
            id={`panelsStayOpen-heading${index}`}
          >
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#panelsStayOpen-collapse${index}`}
              aria-expanded="false"
              aria-controls={`panelsStayOpen-collapse${index}`}
            >
              <strong>{item.title}</strong>
            </button>
          </h2>
          <div
            id={`panelsStayOpen-collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`panelsStayOpen-heading${index}`}
          >
            <div className="accordion-body">{item.formView}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeForm;
