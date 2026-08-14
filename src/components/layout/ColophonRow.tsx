import { Link } from 'react-router-dom';

export function ColophonRow({ label }: { label: string }) {
  return (
    <div className="colophon-row">
      <p className="issue-colophon">{label}</p>
      <Link to="/settings" className="colophon-settings">Settings</Link>
    </div>
  );
}
