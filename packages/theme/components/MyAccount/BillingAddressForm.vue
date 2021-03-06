<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form
      id="billing-details-form"
      class="form"
      @submit.prevent="handleSubmit(submitForm)"
    >
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="billing-details-input_firstName"
            v-model="form.firstName"
            name="firstName"
            label="First Name"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="billing-details-input_lastName"
            v-model="form.lastName"
            name="lastName"
            label="Last Name"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <ValidationProvider
        rules="required|min:5"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="billing-details-input_streetName"
          v-model="form.streetName"
          name="streetName"
          label="Street Name"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
        />
      </ValidationProvider>
      <SfInput
        data-cy="billing-details-input_apartment"
        v-model="form.apartment"
        name="apartment"
        label="House/Apartment number"
        required
        class="form__element"
      />
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="billing-details-input_city"
            v-model="form.city"
            name="city"
            label="City"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          rules="required|min:2"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="billing-details-input_state"
            v-model="form.state"
            name="state"
            label="State/Province"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form__horizontal">
        <ValidationProvider
          rules="required|min:4"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfInput
            data-cy="billing-details-input_zipCode"
            v-model="form.postalCode"
            name="zipCode"
            label="Zip-code"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <!--ValidationProvider
          :rules="`required|oneOf:${countries.map(c => c.name).join(',')}`"
          v-slot="{ errors }"
          class="form__element"
        >
          <SfSelect
            data-cy="billing-details-select_country"
            class="form__select sf-select--underlined"
            v-model="form.country"
            name="country"
            label="Country"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="{ name, label } in countries"
              :key="name"
              :value="name"
            >
              {{ label }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider-->
      </div>
      <ValidationProvider
        rules="required|min:8"
        v-slot="{ errors }"
        class="form__element"
      >
        <SfInput
          data-cy="billing-details-input_phoneNumber"
          v-model="form.phone"
          name="phone"
          label="Phone number"
          required
          :valid="!errors[0]"
          :errorMessage="errors[0]"
        />
      </ValidationProvider>
      <SfCheckbox
        data-cy="billing-details-checkbox_isDefault"
        v-model="form.isDefault"
        name="isDefault"
        label="Set as default"
        class="form__checkbox-isDefault"
      />
      <SfButton data-cy="billing-details-btn_update" class="form__button">
        {{ isNew ? "Add the address" : "Update the address" }}
      </SfButton>
    </form>
  </ValidationObserver>
</template>

<script type="module">
import {
  SfInput,
  SfButton,
  SfSelect,
  SfCheckbox
} from '@storefront-ui/vue';
import { required, min, oneOf } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { ref } from '@vue/composition-api';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('oneOf', {
  ...oneOf,
  message: 'Invalid country'
});

export default {
  name: 'BillingAddressForm',

  components: {
    SfInput,
    SfButton,
    SfSelect,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },

  props: {
    address: {
      type: Object,
      default: () => ({
        id: undefined,
        firstName: '',
        lastName: '',
        streetName: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
        isDefault: false
      })
    },
    isNew: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const form = ref({
      id: props.address.id,
      firstName: props.address.firstName,
      lastName: props.address.lastName,
      streetName: props.address.address1,
      apartment: props.address.address2,
      city: props.address.city,
      state: props.address.province,
      postalCode: props.address.zip,
      // country: props.address.country,
      phone: props.address.phone
      // isDefault: props.address.isDefault
    });

    const submitForm = () => {
      emit('submit', {
        form,
        onComplete: () => {},
        // TODO: Handle Error
        onError: () => {}
      });
    };

    return {
      form,
      submitForm
    };
  }
};
</script>

<style lang='scss' scoped>
.form {
  &__element {
    display: block;
    margin-bottom: var(--spacer-base);
  }
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  &__button {
    display: block;
    margin-top: var(--spacer-lg);
  }
  &__horizontal {
    @include for-desktop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .form__element {
      @include for-desktop {
        flex: 1;
        margin-right: var(--spacer-lg);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
