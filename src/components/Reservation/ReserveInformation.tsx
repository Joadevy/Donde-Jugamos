interface Iprops {
  children: React.ReactNode;
  name: string;
  details: string;
}

function ReserveInformation({children, name, details}: Iprops) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-1">
        {children}
        <p>{name}</p>
      </div>
      <p className="text-right">{details}</p>
    </div>
  );
}

export default ReserveInformation;
