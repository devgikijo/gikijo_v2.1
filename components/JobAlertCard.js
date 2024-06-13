import { useState } from 'react';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';
import toast from 'react-hot-toast';

function JobAlertCard() {
  const { addJobAlertApi } = useApiCall();
  const [buttonConfig, setButtonConfig] = useState({
    submit: {
      isLoading: false,
    },
  });

  const onSubmitJobAlert = async (event) => {
    event.preventDefault();

    setButtonConfig((prevState) => ({
      ...prevState,
      submit: {
        ...prevState.submit,
        isLoading: true,
      },
    }));

    const result = await addJobAlertApi({
      name: document.getElementById('input-name').value,
      email: document.getElementById('input-email').value,
    });

    if (result) {
      toast.success('Submitted!');
    }

    setButtonConfig((prevState) => ({
      ...prevState,
      submit: {
        ...prevState.submit,
        isLoading: false,
      },
    }));
  };

  return (
    <div class="card bg-dark text-white">
      <div class="card-body">
        <h5 class="card-title mb-0" data-lang-key="job_list.get_alert_xxx">
          Get alert for new jobs
        </h5>
        <small class="card-text fw-lighter">
          Stay updated on the latest job postings at Gikijo.
        </small>
        <form onSubmit={onSubmitJobAlert} class="mt-3">
          <div class="mb-3">
            <label htmlFor="input-name" class="form-label">
              Username
            </label>
            <input type="text" class="form-control" id="input-name" required />
          </div>
          <div class="mb-3">
            <label htmlFor="input-email" class="form-label">
              Email
            </label>
            <input
              type="email"
              class="form-control"
              id="input-email"
              required
            />
          </div>
          <div>
            <GlobalButton
              btnType="buttom"
              btnClass="btn btn-primary btn-lg"
              btnTitle="Submit"
              btnLoading={buttonConfig.submit.isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobAlertCard;
