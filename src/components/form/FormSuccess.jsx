const FormSuccess = ({ successMsg }) => {
  return (
    <div className="bg-green-200 border-2 border-green-800 text-green-800 py-2 px-4 font-semibold text-center rounded-lg wrap-break-word">
      {successMsg}
    </div>
  );
};

export default FormSuccess;
