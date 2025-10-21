export default function SidebarFilters() {
  return (
    <aside className="w-1/4 bg-white p-4 rounded-2xl shadow-sm h-fit">
      <h2 className="font-semibold text-lg mb-4">Filters</h2>
      <div className="space-y-4 text-sm">
        <div>
          <p className="font-medium mb-2">Category</p>
          <select className="w-full border rounded-lg px-3 py-2">
            <option>All</option>
            <option>Technology</option>
            <option>Business</option>
            <option>Design</option>
          </select>
        </div>
        <div>
          <p className="font-medium mb-2">Level</p>
          <div className="space-y-1">
            <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Beginner</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Intermediate</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" /> <span>Advanced</span></label>
          </div>
        </div>
        <div>
          <p className="font-medium mb-2">Price</p>
          <input type="range" min="0" max="500" />
        </div>
      </div>
    </aside>
  );
}
