'use client';
import { useMemo } from 'react';
import { Box } from '@mui/material';
import { Order } from 'src/types/order';
import { ICONS } from 'src/config-icons';
import { paths } from 'src/routes/paths';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { fDate } from 'src/utils/format-time';
import SharedTable from 'src/components/SharedTable/SharedTable';


const TABLE_HEAD = [
    { id: 'orderNumber', label: 'Pages.Orders.order_number' },
    { id: 'creationTime', label: 'Pages.Orders.creation_time' },
    { id: 'totalOrderAmount', label: 'Pages.Orders.total_order_amount' },
    { id: 'paymentMethodName', label: 'Pages.Orders.payment_method_name' },
    { id: 'isPaid', label: 'Pages.Orders.is_paid' },
    { id: 'driverName', label: 'Pages.Orders.driver_name' },
    { id: 'status', label: 'Pages.Orders.status' },
  ];
  
  const STATUS_STYLES: Record<string, { label: string; color: string; bgColor: string }> = {
    Pending: { label: 'Pages.Orders.OrderStatus.new_order', bgColor: '#FFAB0029', color: '#B76E00' }, // Yellow
    Processing: {
      label: 'Pages.Orders.OrderStatus.in_progress',
      bgColor: '#00B8D929',
      color: '#006C9C',
    }, // Blue
    Shipped: {
      label: 'Pages.Orders.OrderStatus.out_for_delivery',
      bgColor: '#8E33FF29',
      color: '#5119B7',
    }, // Purple
    Delivered: {
      label: 'Pages.Orders.OrderStatus.completed',
      bgColor: '#00A76F29',
      color: '#007867',
    },
    Success: {
        label: 'Pages.Orders.OrderStatus.success',
        bgColor: '#00A76F29',
        color: '#007867',
      },
     // Green
    Canceled: { label: 'Pages.Orders.OrderStatus.canceled', bgColor: '#FF563029', color: '#B71D18' }, // Red
  };
  

interface Props {
    clientOrderList:Order[]
    total:number
}
export default function ClientOrderTable( {clientOrderList,total}:Props ) {
 const t = useTranslations();
   const router = useRouter();
   const customRender: Record<string, (item: Order) => React.ReactNode> = useMemo(
     () => ({
       orderNumber: (item) => item.orderNumber,
       creationTime: (item) => fDate(item.creationTime, 'dd/MM/yyyy، hh:mm a'),
       totalOrderAmount: (item) => item.totalOrderAmount,
       paymentMethodName: (item) => item.paymentMethodName,
       isPaid: (item) => (item?.transactionStatus==="Success" ? t('Pages.Orders.done') : t('Pages.Orders.not_done')),
       driverName: (item) => (item?.driverName ? item.driverName : t('Pages.Orders.not_limited')),
       status: (item) => {
         const statusInfo = STATUS_STYLES[item.orderStatus] || { label: item.orderStatus, color: '#999' };
         return (
           <Box
             sx={{
               display: 'inline-flex',
               alignItems: 'center',
               backgroundColor: statusInfo.bgColor,
               color: statusInfo.color,
               px: 1.5,
               py: 0.5,
               borderRadius: '12px',
               fontSize: '12px',
               fontWeight: 'bold',
             }}
           >
             {t(statusInfo.label)}
           </Box>
         );
       },
     }),
     [t]
   );
 
   return (
     <>
       <SharedTable
         tableHead={TABLE_HEAD}
         data={clientOrderList}
         count={total}
         customRender={customRender}
         actions={[
           {
             label: 'Pages.Orders.display_order',
             icon: ICONS.global.eye,
             onClick: (item) => {
               router.push(paths.controlPanel.orders.single(item.id));
             },
             sx: { '& .MuiListItemIcon-root rtl-y2uvon-MuiListItemIcon-root': { ml: 0 } }, 
           },
           
         ]}
       />
 

     </>)
}
