interface Iprops {
  children: React.ReactNode;
}

function Information({children}: Iprops) {
  return <div className="flex gap-1 items-center">{children}</div>;
}

export default Information;
