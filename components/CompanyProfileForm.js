import { useEffect, useState } from 'react';
import {
  COMPANY_SIZES,
  COUNTRIES,
  CURRENT_JOB_STATUS,
  GENDERS,
  INDUSTRIES,
  SALARY_TYPES,
} from '../utils/constants';
import Select from 'react-select';
import DynamicWorkExperienceForm from './DynamicWorkExperienceForm';
import DynamicEducationBackgroundForm from './DynamicEducationBackgroundForm';
import GlobalButton from './GlobalButton';
import toast from 'react-hot-toast';
import { useApiCall } from '../context/apiCall';
import DynamicSkillsForm from './DynamicSkillsForm';
import DynamicLanguagesForm from './DynamicLanguagesForm';
import { useModal } from '../context/modal';

const CompanyProfileForm = ({ section = null, onSuccessFunction = null }) => {
  const { apiData, addCompanyProfileApi } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();

  const [formValue, setFormValue] = useState({
    company_name: '',
    registration_number: '',
    website: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    state: '',
    country: '',
    agree_to_term: '',
    about_us: '',
    size: '',
  });

  const [arrayElements, setArrayElements] = useState({
    industries: [],
  });

  const [buttonConfig, setButtonConfig] = useState({
    basicInfo: {
      keyName: 'basicInfo',
      submit: {
        isLoading: false,
      },
    },
    businessOverview: {
      keyName: 'businessOverview',
      submit: {
        isLoading: false,
      },
    },
  });

  useEffect(() => {
    if (apiData.companyProfile.data?.length !== 0) {
      const companyData = apiData.companyProfile.data;
      const updatedFormValue = { ...formValue };
      Object.keys(formValue).forEach((key) => {
        if (companyData.hasOwnProperty(key)) {
          updatedFormValue[key] = companyData[key] || '';
        }
      });

      setFormValue(updatedFormValue);

      var myIndustries = [];
      companyData?.industries?.forEach((item) => {
        const result = INDUSTRIES.find((industry) => industry.value === item);
        if (result) {
          myIndustries.push({ label: result.name, value: result.value });
        }
      });

      setArrayElements((prevState) => ({
        ...prevState,
        industries: myIndustries || [],
      }));
    }
  }, [apiData.companyProfile?.data]);

  const handleChange = (field) => (event) => {
    const { type, value, checked } = event.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [field]: type === 'checkbox' ? checked : value,
    }));
  };

  const configForm = {
    basicInfo: {
      title: 'Basic Info',
      inputValue: {
        company_name: formValue.company_name,
        registration_number: formValue.registration_number,
        website: formValue.website,
        address_1: formValue.address_1,
        address_2: formValue.address_2,
        city: formValue.city,
        postcode: formValue.postcode,
        state: formValue.state,
        country: formValue.country,
        agree_to_term: formValue.agree_to_term,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitCompanyProfile(event, buttonConfig.basicInfo.keyName)
            }
          >
            <div class="col mb-3">
              <label htmlFor="input-company-name" class="form-label">
                Company Name
              </label>
              <input
                type="text"
                class="form-control"
                id="input-company-name"
                value={formValue.company_name}
                onChange={handleChange('company_name')}
                required
              />
            </div>
            <div class="col mb-3">
              <label htmlFor="input-registration-number" class="form-label">
                Registration Number
              </label>
              <input
                type="text"
                class="form-control"
                id="input-registration-number"
                value={formValue.registration_number}
                onChange={handleChange('registration_number')}
              />
            </div>
            <div class="col mb-3">
              <label htmlFor="input-website" class="form-label">
                Website URL
              </label>
              <input
                type="text"
                class="form-control"
                id="input-website"
                value={formValue.website}
                onChange={handleChange('website')}
              />
            </div>
            <div class="col mb-3">
              <label htmlFor="input-address-1" class="form-label">
                Company Address
              </label>
              <div class="row g-2">
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
            </div>
            <div class="mb-3 form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="input-agree-to-term"
                checked={formValue.agree_to_term}
                onChange={handleChange('agree_to_term')}
                required
              />
              <label
                class="form-check-label text-muted"
                htmlFor="input-agree-to-term"
              >
                <small>
                  I confirm that I have read and agreed to the terms and
                  conditions.
                </small>
              </label>
            </div>
            <div class="d-flex justify-content-end">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-primary btn-lg"
                btnTitle="Save Basic Info"
                btnLoading={buttonConfig.basicInfo.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
    businessOverview: {
      title: 'Business Overview',
      inputValue: {
        about_us: formValue.about_us,
        industries: arrayElements.industries.map((item) => item.value),
        size: formValue.size,
      },
      formView: (
        <>
          <form
            onSubmit={(event) =>
              onSubmitCompanyProfile(
                event,
                buttonConfig.businessOverview.keyName
              )
            }
          >
            <div class="col mb-3">
              <label htmlFor="input-about-us" class="form-label">
                About Us
              </label>
              <textarea
                type="text"
                class="form-control"
                id="input-about-us"
                rows="3"
                value={formValue.about_us}
                onChange={handleChange('about_us')}
                required
              />
            </div>
            <div class="col mb-3">
              <label htmlFor="select-industries" class="form-label">
                Industries
              </label>
              <Select
                isMulti
                required
                value={arrayElements.industries}
                options={INDUSTRIES.map((industry) => ({
                  label: industry.name,
                  value: industry.value,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(newValues) => {
                  setArrayElements((prevState) => ({
                    ...prevState,
                    industries: newValues,
                  }));
                }}
              />
            </div>
            <div class="col mb-3">
              <label htmlFor="select-size" class="form-label">
                Company Size
              </label>
              <select
                class="form-select"
                id="select-size"
                value={formValue.size}
                onChange={handleChange('size')}
                required
              >
                <option value="" disabled>
                  Please select
                </option>
                {COMPANY_SIZES.map((item, index) => {
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
                btnTitle="Save Business Overview"
                btnLoading={buttonConfig.businessOverview.submit.isLoading}
              />
            </div>
          </form>
        </>
      ),
    },
  };

  const onSubmitCompanyProfile = async (event, keyName) => {
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

    addData.uid = apiData.companyProfile.data?.uid ?? null;

    var success = false;

    const result = await addCompanyProfileApi({
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

export default CompanyProfileForm;
