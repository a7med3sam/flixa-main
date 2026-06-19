import EmptyContent from '../empty-content';

type Props = {
  notFound: boolean;
};

export default function TableNoData({ notFound }: Props) {
  return (
    <tr>
      {notFound ? (
        <td colSpan={12} className="px-6 py-10 text-center">
          <EmptyContent filled title="No Data" sx={{ py: 10 }} />
        </td>
      ) : (
        <td colSpan={12} className="p-0" />
      )}
    </tr>
  );
}
