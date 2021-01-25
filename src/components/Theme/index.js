import _ from 'lodash';
import { connect } from 'react-redux';
import Theme from './Theme';

const mapStateToProps = (state) => _.pick(state.config, ['theme']);
export default connect(mapStateToProps)(Theme);
