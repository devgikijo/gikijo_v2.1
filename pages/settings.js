import SideBar from '../components/SideBar.js';
import PageHeader from '../components/PageHeader.js';
import { PAGES } from '../utils/constants.js';
import Breadcrumb from '../components/BreadCrumb.js';
import { useApiCall } from '../context/apiCall.js';
import SettingsForm from '../components/SettingsForm.js';

const main = () => {
  const { apiData } = useApiCall();

  return (
    <SideBar>
      <div class="container ps-0">
        <Breadcrumb page={PAGES.settings} />
        <PageHeader
          title={PAGES.settings.name}
          description={PAGES.settings.description}
        />
        <SettingsForm />
      </div>
    </SideBar>
  );
};

export default main;
