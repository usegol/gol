import Mixpanel from 'mixpanel';

const mixpanel = Mixpanel.init(process.env.REACT_APP_MIXPANEL_PROJECT_TOKEN);

export default mixpanel;
