// utils/ai-service.js

/**
 * Generates an AI-powered recommendation based on user data.
 *
 * @param {object} userData - User data including dietary restrictions, goals, etc.
 * @returns {string} - A personalized AI recommendation.  Returns a default recommendation if an error occurs.
 */
export const generateAIRecommendation = async (userData) => {
  try {
    // In a real app, this would call a real AI service (e.g., OpenAI, Google Gemini)

    // Create a more personalized recommendation based on user data
    let recommendation = ""

    // Check if we have user data to personalize the recommendation
    if (userData) {
      const goal = userData.goal || "maintain"
      const restrictions = userData.dietaryRestrictions || []

      // Get today's nutrition data if available
      const today = new Date().toISOString().split("T")[0]
      const savedFoodLog = localStorage.getItem(`foodLog_${today}`)
      let todayNutrition = null

      if (savedFoodLog) {
        const foodLog = JSON.parse(savedFoodLog)
        todayNutrition = foodLog.reduce(
          (acc, food) => {
            acc.calories += food.calories
            acc.protein += food.protein || 0
            acc.carbs += food.carbs || 0
            acc.fat += food.fat || 0
            return acc
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        )
      }

      // Generate recommendation based on goal
      if (goal === "lose-weight") {
        recommendation = `Based on your weight loss goal, I recommend focusing on high-protein, fiber-rich foods that keep you feeling full longer. `

        if (todayNutrition) {
          const calorieGoal = userData.calorieGoal || 2000
          if (todayNutrition.calories > calorieGoal) {
            recommendation += `You've consumed ${todayNutrition.calories} calories today, which is above your goal of ${calorieGoal}. Consider lighter dinner options. `
          } else {
            recommendation += `You've consumed ${todayNutrition.calories} calories today, which is within your goal of ${calorieGoal}. Great job staying on track! `
          }
        }

        recommendation += `Try incorporating more leafy greens, lean proteins, and drinking plenty of water throughout the day.`
      } else if (goal === "gain-muscle") {
        recommendation = `For your muscle gain goal, prioritize protein intake and ensure you're eating enough calories to support muscle growth. `

        if (todayNutrition) {
          const proteinGoal = userData.nutritionGoals?.protein || 150
          if (todayNutrition.protein < proteinGoal) {
            recommendation += `You've consumed ${todayNutrition.protein}g of protein today, which is below your goal of ${proteinGoal}g. Consider adding a protein-rich snack. `
          } else {
            recommendation += `You've consumed ${todayNutrition.protein}g of protein today, which is meeting your goal of ${proteinGoal}g. Great job with your protein intake! `
          }
        }

        recommendation += `Include a mix of complex carbs and healthy fats to fuel your workouts and recovery.`
      } else {
        recommendation = `For maintaining your current weight, focus on balanced nutrition with a good mix of proteins, carbs, and healthy fats. `

        if (todayNutrition) {
          recommendation += `Today you've consumed ${todayNutrition.calories} calories with ${todayNutrition.protein}g protein, ${todayNutrition.carbs}g carbs, and ${todayNutrition.fat}g fat. `
        }

        recommendation += `Stay consistent with your meal timing and portion sizes to maintain your current weight.`
      }

      // Add dietary restriction specific advice
      if (restrictions.length > 0) {
        recommendation += ` Since you follow a ${restrictions.join(", ")} diet, ensure you're getting all essential nutrients. `

        if (restrictions.includes("vegan") || restrictions.includes("vegetarian")) {
          recommendation += `Pay special attention to vitamin B12, iron, and complete protein sources.`
        } else if (restrictions.includes("gluten-free")) {
          recommendation += `Focus on naturally gluten-free whole grains like quinoa and rice.`
        } else if (restrictions.includes("dairy-free")) {
          recommendation += `Ensure adequate calcium intake from non-dairy sources like fortified plant milks and leafy greens.`
        }
      }
    } else {
      // Default recommendation if no user data
      recommendation = `Based on general nutrition principles, I recommend focusing on whole foods, adequate protein intake, and staying hydrated throughout the day. Consider adding more leafy greens to your meals for essential nutrients.`
    }

    return recommendation
  } catch (error) {
    console.error("Error fetching AI recommendation:", error)
    return "Based on your profile and goals, I recommend focusing on protein-rich foods and staying hydrated throughout the day. Consider adding more leafy greens to your meals for essential nutrients."
  }
}

/**
 * Generates a meal plan based on user data.
 *
 * @param {object} userData - User data including dietary restrictions, goals, etc.
 * @returns {object} - A sample meal plan.  Returns a default meal plan if an error occurs.
 */
export const generateMealPlan = async (userData) => {
  try {
    // In a real app, this would call a real AI service (e.g., OpenAI, Google Gemini)

    // Create a more personalized meal plan based on user data
    const mealPlan = {
      monday: {},
      tuesday: {},
      wednesday: {},
    }

    // Check if we have user data to personalize the meal plan
    if (userData) {
      const goal = userData.goal || "maintain"
      const restrictions = userData.dietaryRestrictions || []
      const calorieGoal = userData.calorieGoal || 2000

      // Adjust meal plan based on goal and restrictions
      const proteinPercentage = goal === "gain-muscle" ? 0.35 : goal === "lose-weight" ? 0.3 : 0.25
      const carbPercentage = goal === "gain-muscle" ? 0.45 : goal === "lose-weight" ? 0.35 : 0.5
      const fatPercentage = goal === "gain-muscle" ? 0.2 : goal === "lose-weight" ? 0.35 : 0.25

      // Calculate macros for each meal
      const breakfastCalories = Math.round(calorieGoal * 0.25)
      const lunchCalories = Math.round(calorieGoal * 0.35)
      const dinnerCalories = Math.round(calorieGoal * 0.3)
      const snackCalories = Math.round(calorieGoal * 0.1)

      // Create meal templates based on dietary restrictions
      let proteinSources = ["Chicken breast", "Turkey", "Lean beef", "Salmon", "Tuna", "Eggs"]
      let carbSources = ["Brown rice", "Quinoa", "Sweet potato", "Oats", "Whole grain bread"]
      let fatSources = ["Avocado", "Olive oil", "Nuts", "Seeds", "Nut butter"]
      const veggies = ["Broccoli", "Spinach", "Kale", "Bell peppers", "Carrots", "Zucchini"]
      const fruits = ["Berries", "Banana", "Apple", "Orange", "Mango"]

      // Adjust for dietary restrictions
      if (restrictions.includes("vegetarian")) {
        proteinSources = ["Eggs", "Greek yogurt", "Cottage cheese", "Tofu", "Tempeh", "Lentils", "Beans"]
      }

      if (restrictions.includes("vegan")) {
        proteinSources = ["Tofu", "Tempeh", "Lentils", "Beans", "Chickpeas", "Seitan", "Edamame"]
        fatSources = ["Avocado", "Olive oil", "Nuts", "Seeds", "Nut butter"]
      }

      if (restrictions.includes("gluten-free")) {
        carbSources = ["Brown rice", "Quinoa", "Sweet potato", "Gluten-free oats", "Buckwheat"]
      }

      if (restrictions.includes("dairy-free")) {
        // Remove dairy from protein sources if present
        proteinSources = proteinSources.filter((item) => !["Greek yogurt", "Cottage cheese"].includes(item))
      }

      // Generate meals for each day
      const days = ["monday", "tuesday", "wednesday"]

      days.forEach((day) => {
        // Breakfast
        const breakfastProtein = proteinSources[Math.floor(Math.random() * proteinSources.length)]
        const breakfastCarb = carbSources[Math.floor(Math.random() * carbSources.length)]
        const breakfastFat = fatSources[Math.floor(Math.random() * fatSources.length)]
        const breakfastFruit = fruits[Math.floor(Math.random() * fruits.length)]

        // Lunch
        const lunchProtein = proteinSources[Math.floor(Math.random() * proteinSources.length)]
        const lunchCarb = carbSources[Math.floor(Math.random() * carbSources.length)]
        const lunchVeggie = veggies[Math.floor(Math.random() * veggies.length)]
        const lunchFat = fatSources[Math.floor(Math.random() * fatSources.length)]

        // Dinner
        const dinnerProtein = proteinSources[Math.floor(Math.random() * proteinSources.length)]
        const dinnerCarb = carbSources[Math.floor(Math.random() * carbSources.length)]
        const dinnerVeggie1 = veggies[Math.floor(Math.random() * veggies.length)]
        const dinnerVeggie2 = veggies[Math.floor(Math.random() * veggies.length)]

        // Snack
        const snackProtein = proteinSources[Math.floor(Math.random() * proteinSources.length)]
        const snackFruit = fruits[Math.floor(Math.random() * fruits.length)]

        mealPlan[day] = {
          breakfast: {
            name: `${breakfastProtein} with ${breakfastCarb}`,
            calories: breakfastCalories,
            protein: Math.round((breakfastCalories * proteinPercentage) / 4),
            carbs: Math.round((breakfastCalories * carbPercentage) / 4),
            fat: Math.round((breakfastCalories * fatPercentage) / 9),
            ingredients: [breakfastProtein, breakfastCarb, breakfastFat, breakfastFruit],
            instructions: `Prepare ${breakfastProtein} with ${breakfastCarb} and add ${breakfastFat} for healthy fats. Serve with ${breakfastFruit} on the side.`,
          },
          lunch: {
            name: `${lunchProtein} ${lunchCarb} Bowl`,
            calories: lunchCalories,
            protein: Math.round((lunchCalories * proteinPercentage) / 4),
            carbs: Math.round((lunchCalories * carbPercentage) / 4),
            fat: Math.round((lunchCalories * fatPercentage) / 9),
            ingredients: [lunchProtein, lunchCarb, lunchVeggie, lunchFat],
            instructions: `Cook ${lunchProtein} and serve over ${lunchCarb}. Add ${lunchVeggie} and drizzle with ${lunchFat}.`,
          },
          dinner: {
            name: `${dinnerProtein} with ${dinnerCarb} and Vegetables`,
            calories: dinnerCalories,
            protein: Math.round((dinnerCalories * proteinPercentage) / 4),
            carbs: Math.round((dinnerCalories * carbPercentage) / 4),
            fat: Math.round((dinnerCalories * fatPercentage) / 9),
            ingredients: [dinnerProtein, dinnerCarb, dinnerVeggie1, dinnerVeggie2],
            instructions: `Cook ${dinnerProtein} and serve with ${dinnerCarb}. Roast ${dinnerVeggie1} and ${dinnerVeggie2} as sides.`,
          },
          snacks: [
            {
              name: `${snackProtein} and ${snackFruit}`,
              calories: snackCalories,
              protein: Math.round((snackCalories * 0.3) / 4),
              carbs: Math.round((snackCalories * 0.5) / 4),
              fat: Math.round((snackCalories * 0.2) / 9),
            },
            {
              name: "Mixed nuts",
              calories: snackCalories,
              protein: Math.round((snackCalories * 0.15) / 4),
              carbs: Math.round((snackCalories * 0.15) / 4),
              fat: Math.round((snackCalories * 0.7) / 9),
            },
          ],
        }
      })
    } else {
      // Default meal plan if no user data
      mealPlan.monday = {
        breakfast: {
          name: "Greek Yogurt Parfait",
          calories: 320,
          protein: 22,
          carbs: 40,
          fat: 8,
          ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"],
          instructions: "Layer yogurt, berries, and granola in a bowl. Drizzle with honey.",
        },
        lunch: {
          name: "Quinoa Salad Bowl",
          calories: 450,
          protein: 15,
          carbs: 65,
          fat: 15,
          ingredients: ["Quinoa", "Cucumber", "Cherry tomatoes", "Avocado", "Feta cheese", "Olive oil", "Lemon juice"],
          instructions:
            "Mix cooked quinoa with chopped vegetables. Add feta cheese and dress with olive oil and lemon juice.",
        },
        dinner: {
          name: "Baked Salmon with Roasted Vegetables",
          calories: 520,
          protein: 35,
          carbs: 30,
          fat: 25,
          ingredients: ["Salmon fillet", "Broccoli", "Bell peppers", "Zucchini", "Olive oil", "Garlic", "Lemon"],
          instructions:
            "Season salmon with garlic, salt, and pepper. Bake at 400°F for 15 minutes. Roast vegetables with olive oil.",
        },
        snacks: [
          {
            name: "Apple with Almond Butter",
            calories: 200,
            protein: 5,
            carbs: 25,
            fat: 10,
          },
          {
            name: "Protein Shake",
            calories: 150,
            protein: 20,
            carbs: 5,
            fat: 3,
          },
        ],
      }

      // Copy Monday's plan to other days with slight variations
      mealPlan.tuesday = JSON.parse(JSON.stringify(mealPlan.monday))
      mealPlan.tuesday.breakfast.name = "Veggie Omelette"
      mealPlan.tuesday.lunch.name = "Turkey Avocado Wrap"
      mealPlan.tuesday.dinner.name = "Lentil Curry with Brown Rice"

      mealPlan.wednesday = JSON.parse(JSON.stringify(mealPlan.monday))
      mealPlan.wednesday.breakfast.name = "Overnight Oats"
      mealPlan.wednesday.lunch.name = "Mediterranean Bowl"
      mealPlan.wednesday.dinner.name = "Grilled Chicken with Sweet Potato"
    }

    return mealPlan
  } catch (error) {
    console.error("Error generating meal plan:", error)
    return null
  }
}

