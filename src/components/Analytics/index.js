import _ from 'lodash';
import { connect } from 'react-redux';
import Analytics from './Analytics';

const mapStateToProps = (state) => _.pick(state.config, ['analytics']);
export default connect(mapStateToProps)(Analytics);
