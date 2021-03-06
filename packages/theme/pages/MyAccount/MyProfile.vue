<template>
  <SfTabs :open-tab="1">
    <SfTab data-cy="my-profile-tab_personal-data" title="Personal data">
      <p class="message">
        Feel free to edit any of your details below so your account is always up
        to date
      </p>
      <SfAlert v-if="success" class="alert" type="success" :message="success" />
      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="form" @submit.prevent="handleSubmit(updateProfile)">
          <div class="form__horizontal">
            <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="my-profile-input_firstName"
                v-model= "form.firstName"
                name="firstName"
                label="First Name"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|min:2" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="my-profile-input_lastName"
                v-model= "form.lastName"
                name="lastName"
                label="Last Name"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
          </div>
          <ValidationProvider rules="required|email" v-slot="{ errors }" class="form__element">
            <SfInput
              data-cy="my-profile-input_email"
              v-model= "form.email"
              type="email"
              name="email"
              label="Your e-mail"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <SfButton data-cy="my-profile-btn_update" class="form__button">Update personal data</SfButton>
        </form>
      </ValidationObserver>
      <p class="notice">
        At Brand name, we attach great importance to privacy issues and are
        committed to protecting the personal data of our users. Learn more about
        how we care and use your personal data in the
        <a href="">Privacy Policy.</a>
      </p>
    </SfTab>
    <SfTab data-cy="my-profile-tab_password-change" title="Password change">
      <p class="message">
        If you want to change the password to access your account, enter the
        following information:<br />Your current email address is
        <span class="message__label">example@email.com</span>
      </p>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form class="form" @submit.prevent="handleSubmit(updatePassword)">
          <ValidationProvider rules="required" v-slot="{ errors }" vid="password" class="form__element">
            <SfInput
              data-cy="my-profile-input_currentPassword"
              v-model="form.currentPassword"
              type="password"
              name="currentPassword"
              label="Current Password"
              required
              :valid="!errors[0]"
              :errorMessage="errors[0]"
            />
          </ValidationProvider>
          <div class="form__horizontal">
            <ValidationProvider rules="required|password" v-slot="{ errors }" vid="password" class="form__element">
              <SfInput
                data-cy="my-profile-input_newPassword"
                v-model="form.newPassword"
                type="password"
                name="newPassword"
                label="New Password"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider rules="required|confirmed:password" v-slot="{ errors }" class="form__element">
              <SfInput
                data-cy="my-profile-input_repeatPassword"
                v-model="form.repeatPassword"
                type="password"
                name="repeatPassword"
                label="Repeat Password"
                required
                :valid="!errors[0]"
                :errorMessage="errors[0]"
              />
            </ValidationProvider>
          </div>
          <SfAlert v-if="error" class="alert" type="danger" :message="error" />
          <SfButton data-cy="my-profile-btn_update-password" class="form__button">Update password</SfButton>
        </form>
      </ValidationObserver>
    </SfTab>
  </SfTabs>
</template>
<script type="module">
import { ref } from '@vue/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import { SfTabs, SfInput, SfButton, SfAlert } from '@storefront-ui/vue';
import { useUser, userGetters } from '@vue-storefront/shopify';
import { onSSR } from '@vue-storefront/core';
extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('password', {
  validate: value => String(value).length >= 8 && String(value).match(/[A-Za-z]/gi) && String(value).match(/[0-9]/gi),
  message: 'Password must have at least 8 characters including one letter and a number'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

export default {
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfInput,
    SfButton,
    SfAlert,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    account: {
      type: Object,
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      default: () => ({})
    }
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const { user, load: loadUser, changePassword, updateUser } = useUser();
    const success = ref(null);
    const error = ref(null);
    const resetForm = () => ({
      firstName: userGetters.getFirstName(user.value),
      lastName: userGetters.getLastName(user.value),
      email: userGetters.getEmailAddress(user.value)
    });
    const form = ref(resetForm());
    const handleForm = (fn, reset) => async () => {
      try {
        await fn({ user: form.value });
        success.value = 'Customer updated successfully';
      } catch (e) {
        error.value = e.message;
        return;
      }

      if (reset) {
        form.value = {};
      }
    };

    const updatePassword = async () => handleForm(changePassword, true)();

    const updateProfile = async () => handleForm(updateUser, false)();
    onSSR(async () => {
      await loadUser();
    });
    return {
      user,
      error,
      success,
      form,
      updatePassword,
      updateProfile
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  head () {
    return {
      title: 'My profile : Shopify PWA'
    };
  }
};
</script>
<style lang='scss' scoped>
@import "~@storefront-ui/vue/styles";

.form {
  &__element {
    display: block;
    margin: 0 0 var(--spacer-2xl) 0;
  }

  &__button {
    display: block;
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
        margin-right: var(--spacer-2xl);
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.message,
.notice {
  font-family: var(--font-family-primary);
  line-height: 1.6;
}
.message {
  margin: 0 0 var(--spacer-2xl) 0;
  font-size: var(--font-base-mobile);
  @include for-desktop {
    font-size: var(--font-base-desktop);
  }
  &__label {
    font-weight: 400;
  }
}
.notice {
  margin: var(--spacer-xl) 0 0 0;
  font-size: var(--font-xs-mobile);
  @include for-desktop {
    max-width: 70%;
    margin: var(--spacer) 0 0 0;
    font-size: var(--font-xs-desktop);
  }
}
</style>
