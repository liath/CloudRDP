import _ from 'lodash';
import { connect } from 'react-redux';
import Settings from './Settings';
import {
  setAnalytics,
  setRegion,
  setSSMPrefix,
  setTheme,
} from '../../store/config/actions';

const mapStateToProps = (state) =>
  _.pick(state.config, ['analytics', 'region', 'ssmPrefix', 'theme']);
const mapDispatchToProps = { setAnalytics, setRegion, setSSMPrefix, setTheme };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
