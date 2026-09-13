import './SearchBar.css';
import Icon from './Icon';

function SearchBar({ placeholder = 'Search...', value, onChange }) {
  return (
    <div className="search-bar">
      <Icon name="search" size={19} className="search-icon" />
      <input
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
