<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import {  ref } from 'vue';
import type { Customers } from '@/types/customers';
import type { ApiResponse, Pagination, TableHeader } from '@/types/table.ts';
import type { AxiosResponse } from 'axios';
import { customersServices } from '@/api/services/customersServices.ts';
import moment from 'moment';
import { mdiPencil ,mdiEyeOutline} from '@mdi/js'
const page = ref({ title: 'Quản Lý Khách Hàng' });
const breadcrumbs = ref([
  {
    title: 'Utilities',
    disabled: false,
    href: '#'
  },
  {
    title: 'Typography',
    disabled: true,
    href: '#'
  }
]);

const loading = ref<boolean>(false)
const search = ref<string>('')
const items = ref<Customers[]>([])
const pagination = ref<Pagination>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
})
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  console.log('Formatting date:', dateStr);
  return moment(dateStr).format('L');
}

const headers: TableHeader[] = [
  { title: 'ID', value: 'id', align: 'center', width: '80px' },
  { title: 'Họ và tên', value: 'fullName' },
  { title: 'Số điện thoại', value: 'phoneNumber' },
  { title: 'Zalo ID', value: 'zaloId' },
  { title: 'Vị trí mặc định', value: 'location', sortable: false },
  { title: 'Ngày tạo', value: 'createdAt' },
  { title: 'Ngày cập nhật', value: 'updatedAt' },
  { title: 'Thao tác', value: 'actions', sortable: false, align: 'center', width: '120px' },
];

const emit = defineEmits<{
  (e: 'view', item: Customers): void;
  (e: 'edit', item: Customers): void;
  (e: 'error', message: string): void;
}>();


const fetchData = async (): Promise<void> => {
  loading.value = true;
  try {
    const response: AxiosResponse<ApiResponse> = await customersServices.getCustomers({
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: search.value,
    });

    items.value = response.data;

    console.log('Response Data:', response.data);
    // Cập nhật lại total và các info khác
    pagination.value = {
      ...pagination.value,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages
    };
  } catch (error: unknown) {
    console.error('Lỗi:', error);
    emit('error', 'Không thể tải dữ liệu khách hàng');
  } finally {
    loading.value = false;
  }
};


</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Danh Sách Khách Hàng">
        <v-data-table-server
          v-model:items-per-page="pagination.limit"
          v-model:page="pagination.page"
          :headers="headers"
          :items="items"
          :items-length="pagination.total"
          :loading="loading"
          item-value="id"
          @update:options="fetchData"
        >
          <template v-slot:[`item.id`]="{ item }">
            <span class="font-weight-bold">#{{ item.id }}</span>
          </template>

          <template v-slot:[`item.createdAt`]="{ item }">
            <span>{{ formatDate(item.raw ? item.raw.createdAt : item.createdAt) }}</span>
          </template>

          <template v-slot:[`item.updatedAt`]="{ item }">
            <span>{{formatDate(item.raw ? item.raw.updatedAt : item.updatedAt) }}</span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip text="Xem chi tiết" location="top">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" icon flat v-bind="props" @click="emit('view', item)">
                  <v-icon  :icon="mdiEyeOutline"></v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Chỉnh sửa" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon color="#FFEB3B" flat v-bind="props" @click="emit('edit', item)">
                  <v-icon :icon="mdiPencil"></v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="mt-2">Không tìm thấy dữ liệu phù hợp</v-alert>
          </template>

        </v-data-table-server>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>